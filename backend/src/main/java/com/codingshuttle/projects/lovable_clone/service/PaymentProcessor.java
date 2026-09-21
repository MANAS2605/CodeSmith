package com.codingshuttle.projects.lovable_clone.service;

import com.codingshuttle.projects.lovable_clone.dto.subscription.CheckOutRequest;
import com.codingshuttle.projects.lovable_clone.dto.subscription.CheckOutResponse;
import com.codingshuttle.projects.lovable_clone.dto.subscription.PortalResponse;
import com.stripe.model.StripeObject;

import java.util.Map;

public interface PaymentProcessor {
    CheckOutResponse createCheckoutSessionUrl(CheckOutRequest request);

    PortalResponse openCustomerPortal();


    void handleWebhookEvent(String type, StripeObject stripeObject, Map<String, String> metadata);
}
