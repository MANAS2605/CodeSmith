import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { ProjectMember, ProjectRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { projectTone } from "@/lib/utils";

interface ShareDialogProps {
  projectId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareDialog({
  projectId,
  trigger,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const { toast } = useToast();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<ProjectRole>("EDITOR");
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, projectId]);

  const loadMembers = async () => {
    try {
      const data = await api.getProjectMembers(projectId);
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members", error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setLoading(true);
    try {
      await api.inviteMember(projectId, inviteEmail, inviteRole);
      toast({
        title: "Invite sent",
        description: `Invited ${inviteEmail} to the project.`,
      });
      setInviteEmail("");
      loadMembers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to invite",
        description: "Could not send invitation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: ProjectRole) => {
    try {
      await api.updateMemberRole(projectId, userId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId ? { ...m, role: newRole } : m))
      );
      toast({ title: "Role updated" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await api.removeMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      toast({ title: "Member removed" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md rounded-[6px] border border-border bg-card p-6 shadow-md text-foreground">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
            Share Project
          </DialogTitle>
        </DialogHeader>

        {/* Invite Row */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              className="flex-1 h-9 text-xs rounded-[6px] bg-background border-input focus-visible:ring-signal"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || loading}
              className="h-9 px-4 rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shrink-0"
            >
              Invite
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">Role:</span>
            <Select
              value={inviteRole}
              onValueChange={(val) => setInviteRole(val as ProjectRole)}
            >
              <SelectTrigger className="h-8 text-xs rounded-[5px] bg-background border-border w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="rounded-[6px] border-border bg-popover text-xs">
                <SelectItem value="VIEWER">Can view</SelectItem>
                <SelectItem value="EDITOR">Can edit</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            People with access
          </h4>

          <div className="divide-y divide-border border border-border rounded-[6px] max-h-[260px] overflow-y-auto bg-background">
            {members.length === 0 && (
              <div className="h-12 px-3 flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarFallback className="text-[11px] font-semibold bg-muted text-foreground">
                    YOU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-xs min-w-0">
                  <div className="font-medium text-foreground truncate">You</div>
                  <div className="text-[11px] text-muted-foreground truncate">Project Creator</div>
                </div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground px-2">
                  Owner
                </span>
              </div>
            )}

            {members.map((member) => {
              const displayName = member.name || member.username;
              const tone = projectTone(displayName);
              const initial = displayName.charAt(0).toUpperCase();

              return (
                <div
                  key={member.userId}
                  className="h-12 px-3 flex items-center gap-3 hover:bg-panel-hover/50 transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-full border border-border">
                    <AvatarFallback
                      className="text-[11px] font-semibold"
                      style={{ backgroundColor: tone.bg, color: tone.fg }}
                    >
                      {initial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-medium text-foreground truncate">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate font-mono">
                      {member.username}
                    </div>
                  </div>

                  {member.role === "OWNER" ? (
                    <span className="text-[11px] font-mono uppercase text-muted-foreground px-2">
                      Owner
                    </span>
                  ) : (
                    <Select
                      defaultValue={member.role}
                      onValueChange={(val) => {
                        if (val === "REMOVE") handleRemoveMember(member.userId);
                        else handleRoleChange(member.userId, val as ProjectRole);
                      }}
                    >
                      <SelectTrigger className="h-7 w-[96px] text-xs border-none bg-transparent hover:bg-muted focus:ring-1 focus:ring-signal shadow-none p-1 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end" className="rounded-[6px] border-border bg-popover text-xs">
                        <SelectItem value="EDITOR">Can edit</SelectItem>
                        <SelectItem value="VIEWER">Can view</SelectItem>
                        <SelectItem
                          value="REMOVE"
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          Remove
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
