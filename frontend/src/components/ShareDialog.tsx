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
import { Sparkles, Users, UserPlus } from "lucide-react";

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
        title: "Astral Invitation Dispatched",
        description: `Invited ${inviteEmail} to collaborate on this orbit.`,
      });
      setInviteEmail("");
      loadMembers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to Invite",
        description: "Could not dispatch invitation.",
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
      toast({ title: "Clearance Updated" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update clearance level.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await api.removeMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      toast({ title: "Collaborator Removed" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove collaborator.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md rounded-xl border border-[#6D28D9]/40 celestial-glass p-6 shadow-2xl text-foreground">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#6D28D9]/20 text-[#06B6D4] border border-[#6D28D9]/30">
              <Users className="w-4 h-4 text-[#06B6D4]" />
            </span>
            <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
              Share Project Orbit
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Invite Row */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="explorer@cosmos.io"
              className="flex-1 h-9 text-xs rounded-lg bg-background/80 border-border/80 focus-visible:border-[#06B6D4] focus-visible:ring-2 focus-visible:ring-[#EC4899]/30"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || loading}
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white text-xs font-medium shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.3)] gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">Clearance:</span>
            <Select
              value={inviteRole}
              onValueChange={(val) => setInviteRole(val as ProjectRole)}
            >
              <SelectTrigger className="h-8 text-xs rounded-lg bg-background/80 border-border/80 w-32 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" className="rounded-xl border-border/80 bg-popover/95 backdrop-blur-md text-xs">
                <SelectItem value="VIEWER">Can view</SelectItem>
                <SelectItem value="EDITOR">Can edit</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#06B6D4]" />
            <span>Orbit Collaborators</span>
          </h4>

          <div className="divide-y divide-border/60 border border-border/80 dark:border-[#6D28D9]/30 rounded-xl max-h-[260px] overflow-y-auto bg-background/60 backdrop-blur-md">
            {members.length === 0 && (
              <div className="h-12 px-3.5 flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-full ring-1 ring-[#6D28D9]/50">
                  <AvatarFallback className="text-[11px] font-semibold bg-gradient-to-tr from-[#6D28D9] to-[#06B6D4] text-white">
                    YOU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-xs min-w-0">
                  <div className="font-medium text-foreground truncate">You</div>
                  <div className="text-[11px] text-muted-foreground truncate">Orbit Commander</div>
                </div>
                <span className="text-[10px] font-mono uppercase text-amber-500 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
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
                  className="h-12 px-3.5 flex items-center gap-3 hover:bg-[#6D28D9]/15 transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-full border border-[#6D28D9]/30">
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
                    <span className="text-[10px] font-mono uppercase text-amber-500 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
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
                      <SelectTrigger className="h-7 w-[96px] text-xs border-none bg-transparent hover:bg-[#6D28D9]/15 focus:ring-1 focus:ring-[#06B6D4] shadow-none p-1 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end" className="rounded-xl border-border/80 bg-popover/95 backdrop-blur-md text-xs">
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
