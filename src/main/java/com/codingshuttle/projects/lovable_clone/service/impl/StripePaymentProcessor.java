package com.codingshuttle.projects.lovable_clone.service.impl;

import com.codingshuttle.projects.lovable_clone.dto.subscription.CheckOutRequest;
import com.codingshuttle.projects.lovable_clone.dto.subscription.CheckOutResponse;
import com.codingshuttle.projects.lovable_clone.dto.subscription.PortalResponse;
import com.codingshuttle.projects.lovable_clone.entity.Plan;
import com.codingshuttle.projects.lovable_clone.entity.User;
import com.codingshuttle.projects.lovable_clone.enums.SubscriptionStatus;
import com.codingshuttle.projects.lovable_clone.error.BadRequestException;
import com.codingshuttle.projects.lovable_clone.error.ResourceNotFoundException;
import com.codingshuttle.projects.lovable_clone.repository.PlanRepository;
import com.codingshuttle.projects.lovable_clone.repository.UserRepository;
import com.codingshuttle.projects.lovable_clone.security.AuthUtil;
import com.codingshuttle.projects.lovable_clone.service.PaymentProcessor;
import com.codingshuttle.projects.lovable_clone.service.SubscriptionService;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class StripePaymentProcessor implements PaymentProcessor {
    private final AuthUtil authUtil;
    private final PlanRepository planRepository;
    private final UserRepository userRepository;
    private final SubscriptionService subscriptionService;

    @Value("${client.url}")
    private String frontendUrl;


    @Override
    public CheckOutResponse createCheckoutSessionUrl(CheckOutRequest request) {
        Plan plan=planRepository.findById(request.planId()).orElseThrow(
                ()-> new ResourceNotFoundException("Plan",request.planId().toString())
        );
        Long userId = authUtil.getCurrentUserId();
        User user = getUser(userId);

        var params = SessionCreateParams.builder()
                .addLineItem(//to add one item with user defined quantities
                        SessionCreateParams.LineItem.builder().setPrice(plan.getStripePriceId()).setQuantity(1L).build())
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSubscriptionData(
                        new SessionCreateParams.SubscriptionData.Builder()
                                .setBillingMode(SessionCreateParams.SubscriptionData.BillingMode.builder()
                                .setType(SessionCreateParams.SubscriptionData.BillingMode.Type.FLEXIBLE)
                                .build())
                        .build()
                )
                .setSuccessUrl(frontendUrl + "/success.html?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/cancel.html")
                .putMetadata("user_id",userId.toString())
                .putMetadata("plan_id",plan.getId().toString());

        try {
            String stripeCustomerId=user.getStripeCustomerId();
            if(stripeCustomerId==null||stripeCustomerId.isEmpty()){
                params.setCustomerEmail(user.getUsername());
            }else{
                params.setCustomer(stripeCustomerId);//stripe customer id
            }
            Session session = Session.create(params.build()); //making the api call to the stripe backend
            return new CheckOutResponse(session.getUrl());
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }



    @Override
    public PortalResponse openCustomerPortal() {
        Long userId=authUtil.getCurrentUserId();
        User user=getUser(userId);
        String stripeCustomerId=user.getStripeCustomerId();

        if(stripeCustomerId==null||stripeCustomerId.isEmpty()){
            throw new BadRequestException("User does not have a Stripe Customer Id, UserId : "+userId);
        }
        try {
            var portalSession= com.stripe.model.billingportal.Session.create(
                    com.stripe.param.billingportal.SessionCreateParams.builder()
                            .setCustomer(stripeCustomerId)
                            .setReturnUrl(frontendUrl)
                            .build()
            );
            return new PortalResponse(portalSession.getUrl());
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }


    }

    @Override
    public void handleWebhookEvent(String type, StripeObject stripeObject, Map<String, String> metadata) {
        log.debug("Handling stripe event : {}",type);
    
        switch (type){
            //minimal events for a complete integration of  payment processor
            case "checkout.session.completed" -> handleCheckoutSessionCompleted((Session) stripeObject,metadata);//one time,on checkout completed
            case "customer.subscription.updated" -> handleCustomerSubscriptionUpdated((Subscription) stripeObject);//when user cancels,upgrades or any update
            case "customer.subscription.deleted" -> handleCustomerSubscriptionDeleted((Subscription) stripeObject);//when subscription ends,revoke the access
            case "invoice.paid" -> handleInvoicePaid((Invoice) stripeObject);//when invoice is paid
            case "invoice.payment_failed" -> handleInvoicePaymentFailed((Invoice) stripeObject);//when invoice is not paid,mark as PAST_DUE
            default -> log.debug("Ignoring the event: {}",type);
        }
    }

    private void handleCheckoutSessionCompleted(Session session,Map<String,String> metadata ) {

        if (session==null){
            log.error("Session object is null");
            return;
        }

        Long userId = Long.parseLong(metadata.get("user_id"));
        Long planId = Long.parseLong(metadata.get("plan_id"));

        String subscriptionId = session.getSubscription();
        String customerId= session.getCustomer();

        User user= getUser(userId);
        if(user.getStripeCustomerId()==null){
            user.setStripeCustomerId(customerId);
            userRepository.save(user);
        }
        subscriptionService.activateSubscription(userId,planId,subscriptionId,customerId);

    }

    private void handleCustomerSubscriptionUpdated(Subscription subscription) {
        if (subscription==null){
            log.error("Subscription object is null inside handleCustomerSubscriptionUpdated");
            return;
        }


        SubscriptionStatus status = mapStripeStatusToEnum(subscription.getStatus());
        if (status == null) {
            log.warn("Unknown status '{}' for subscription {}", subscription.getStatus(), subscription.getId());
            return;
        }

        SubscriptionItem item = subscription.getItems().getData().get(0);
        Instant periodStart = toInstant(item.getCurrentPeriodStart());
        Instant periodEnd = toInstant(item.getCurrentPeriodEnd());

        Long planId = resolvePlanId(item.getPrice());

        subscriptionService.updateSubscription(
                subscription.getId(), status, periodStart, periodEnd,
                subscription.getCancelAtPeriodEnd(), planId//getCancelAtPeriodEnd- just to show that now further payment is cancelled
        );

    }

    private void handleCustomerSubscriptionDeleted(Subscription subscription) {
        if (subscription==null){
            log.error("Subscription object is null inside handleCustomerSubscriptionDeleted");
            return;
        }

        subscriptionService.cancelSubscription(subscription.getId());


    }

    private void handleInvoicePaid(Invoice invoice) {
        String subId= extractSubscriptionId(invoice);
        if (subId==null) return;

        try {
            Subscription subscription= Subscription.retrieve(subId);//sdk calling stripe server
            var item = subscription.getItems().getData().get(0);

            Instant periodStart = toInstant(item.getCurrentPeriodStart());
            Instant periodEnd = toInstant(item.getCurrentPeriodEnd());

            subscriptionService.renewSubscriptionPeriod(
                    subId,
                    periodStart,
                    periodEnd
            );
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }

    private void handleInvoicePaymentFailed(Invoice invoice) {

        String subId= extractSubscriptionId(invoice);
        if (subId==null) return;

        subscriptionService.markSubscriptionPastDue(subId);

    }

    /// // Utility Methods

    private User getUser(Long userId) {//stripe customer id
        User user=userRepository.findById(userId).orElseThrow(()->
                new ResourceNotFoundException("User", userId.toString()));
        return user;
    }

    private SubscriptionStatus mapStripeStatusToEnum(String status) {
        return switch (status) {
            case "active" -> SubscriptionStatus.ACTIVE;
            case "trialing" -> SubscriptionStatus.TRIALING;
            case "past_due", "unpaid", "paused", "incomplete_expired" -> SubscriptionStatus.PAST_DUE;
            case "canceled" -> SubscriptionStatus.CANCELED;
            case "incomplete" -> SubscriptionStatus.INCOMPLETE;
            default -> {
                log.warn("Unmapped Stripe status: {}", status);
                yield null;
            }
        };
    }

    private Instant toInstant(Long epoch) {
        return epoch != null ? Instant.ofEpochSecond(epoch) : null;
    }

    private Long resolvePlanId(Price price) {
        if (price == null || price.getId() == null) return null;
        return planRepository.findByStripePriceId(price.getId())
                .map(Plan::getId)
                .orElse(null);
    }

    private String extractSubscriptionId(Invoice invoice){
        var parent= invoice.getParent();
        if(parent==null) return null;

        var subDetails=parent.getSubscriptionDetails();
        if(subDetails==null) return null;

        return subDetails.getSubscription();
    }

}
