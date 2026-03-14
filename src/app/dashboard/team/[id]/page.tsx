"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter, useParams } from "next/navigation";
import {
    Bot,
    Plus,
    Mail,
    Crown,
    Wrench,
    Headphones,
    MoreHorizontal,
    X,
    Send,
    Trash2,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { Sidebar, useSidebarState } from "@/components/sidebar";

const allAgents = [
    { id: "wn_abc123xyz", name: "Customer Support Bot", status: "active", theme: "#7c3aed", initials: "CS" },
    { id: "wn_def456uvw", name: "Sales Assistant", status: "active", theme: "#3b82f6", initials: "SA" },
    { id: "wn_ghi789rst", name: "Product Expert", status: "paused", theme: "#10b981", initials: "PE" },
];

type Role = "Owner" | "Admin" | "Support Agent";
type MemberStatus = "Active" | "Pending" | "Inactive";

type Member = {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: MemberStatus;
    lastActive: string;
    initials: string;
    avatarColor: string;
};

const roleConfig: Record<Role, {
    icon: React.ElementType;
    color: string;
    bg: string;
    darkBg: string;
    border: string;
    description: string;
    permissions: string[];
    restrictions: string[];
}> = {
    Owner: {
        icon: Crown,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50",
        darkBg: "dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        description: "Full access to everything",
        permissions: ["Everything", "Delete Workspace", "Manage Billing", "Remove Admins"],
        restrictions: [],
    },
    Admin: {
        icon: Wrench,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50",
        darkBg: "dark:bg-violet-900/20",
        border: "border-violet-200 dark:border-violet-800",
        description: "Manage bots, settings & team",
        permissions: ["Bot Training", "Settings", "Integrations", "Team Management"],
        restrictions: ["Cannot manage Billing", "Cannot delete Workspace"],
    },
    "Support Agent": {
        icon: Headphones,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50",
        darkBg: "dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        description: "View conversations & analytics",
        permissions: ["View Conversations", "Live Chat", "View Analytics"],
        restrictions: ["Cannot change Settings", "Cannot train Bot", "Cannot view Billing"],
    },
};

const statusConfig: Record<MemberStatus, { icon: React.ElementType; color: string; bg: string; dot: string }> = {
    Active: { icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", dot: "bg-emerald-500" },
    Pending: { icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500" },
    Inactive: { icon: AlertCircle, color: "text-zinc-500 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800", dot: "bg-zinc-400" },
};

const initialMembers: Member[] = [
    { id: "1", name: "John Doe", email: "john@company.com", role: "Owner", status: "Active", lastActive: "Just now", initials: "JD", avatarColor: "#7c3aed" },
    { id: "2", name: "Sarah Chen", email: "sarah@company.com", role: "Admin", status: "Active", lastActive: "2 mins ago", initials: "SC", avatarColor: "#3b82f6" },
    { id: "3", name: "Mike Torres", email: "mike@company.com", role: "Support Agent", status: "Active", lastActive: "1 hour ago", initials: "MT", avatarColor: "#10b981" },
    { id: "4", name: "Priya Nair", email: "priya@company.com", role: "Support Agent", status: "Pending", lastActive: "—", initials: "PN", avatarColor: "#f97316" },
];

export default function TeamPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [members, setMembers] = React.useState<Member[]>(initialMembers);
    const [showInviteModal, setShowInviteModal] = React.useState(false);
    const [inviteEmail, setInviteEmail] = React.useState("");
    const [inviteRole, setInviteRole] = React.useState<Role>("Support Agent");
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [openRoleDropdownId, setOpenRoleDropdownId] = React.useState<string | null>(null);
    const [inviteSent, setInviteSent] = React.useState(false);

    const currentAgent = allAgents.find(a => a.id === agentId) || allAgents[0];

    const handleSendInvite = () => {
        if (!inviteEmail.trim()) return;
        const newMember: Member = {
            id: Date.now().toString(),
            name: inviteEmail.split("@")[0],
            email: inviteEmail,
            role: inviteRole,
            status: "Pending",
            lastActive: "—",
            initials: inviteEmail.slice(0, 2).toUpperCase(),
            avatarColor: "#6366f1",
        };
        setMembers(prev => [...prev, newMember]);
        setInviteSent(true);
        setTimeout(() => {
            setInviteSent(false);
            setShowInviteModal(false);
            setInviteEmail("");
            setInviteRole("Support Agent");
        }, 1500);
    };

    const handleRoleChange = (memberId: string, newRole: Role) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
        setOpenRoleDropdownId(null);
    };

    const handleRemoveMember = (memberId: string) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
        setOpenMenuId(null);
    };

    const handleResend = (memberId: string) => {
        // Simulate resend
        setOpenMenuId(null);
    };

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950" onClick={() => { setOpenMenuId(null); setOpenRoleDropdownId(null); }}>
            <Sidebar activePage="team" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className={mainClass}>
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: currentAgent.theme }}>
                            {currentAgent.initials}
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{currentAgent.name}</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Team & Permissions</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="p-6">
                    {/* Page Header */}
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Team & Permissions</h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage who has access to your bot and settings.</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowInviteModal(true); }}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40"
                        >
                            <Plus className="h-4 w-4" />
                            Invite Member
                        </button>
                    </div>

                    {/* Role Legend Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                        {(Object.entries(roleConfig) as [Role, typeof roleConfig[Role]][]).map(([role, config]) => (
                            <div key={role} className={`rounded-xl border p-4 ${config.bg} ${config.darkBg} ${config.border}`}>
                                <div className="mb-2 flex items-center gap-2">
                                    <config.icon className={`h-4 w-4 ${config.color}`} />
                                    <span className={`text-sm font-bold ${config.color}`}>{role}</span>
                                </div>
                                <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">{config.description}</p>
                                <div className="space-y-1">
                                    {config.permissions.map(p => (
                                        <div key={p} className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{p}</span>
                                        </div>
                                    ))}
                                    {config.restrictions.map(r => (
                                        <div key={r} className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                            <span className="text-[11px] text-zinc-500 dark:text-zinc-500">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Members Table */}
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
                            <div className="col-span-4 flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-zinc-500" />
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">User (Info)</span>
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Crown className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Role (Access)</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Status</span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Last Active</span>
                            </div>
                            <div className="col-span-1">
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Actions</span>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {members.map((member) => {
                                const RoleIcon = roleConfig[member.role].icon;
                                const statusCfg = statusConfig[member.status];
                                const StatusIcon = statusCfg.icon;
                                const isOwner = member.role === "Owner";

                                return (
                                    <div key={member.id} className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                        {/* User Info */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                                                style={{ backgroundColor: member.avatarColor }}
                                            >
                                                {member.initials}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{member.name}</p>
                                                    {isOwner && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{member.email}</p>
                                            </div>
                                        </div>

                                        {/* Role Dropdown */}
                                        <div className="col-span-3 flex items-center">
                                            <div className="relative" onClick={e => e.stopPropagation()}>
                                                <button
                                                    disabled={isOwner}
                                                    onClick={() => setOpenRoleDropdownId(openRoleDropdownId === member.id ? null : member.id)}
                                                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${roleConfig[member.role].bg} ${roleConfig[member.role].darkBg} ${roleConfig[member.role].border} ${roleConfig[member.role].color} ${isOwner ? "cursor-default opacity-80" : "hover:shadow-sm cursor-pointer"}`}
                                                >
                                                    <RoleIcon className="h-3.5 w-3.5" />
                                                    {member.role}
                                                    {!isOwner && <ChevronDown className="h-3 w-3 opacity-60" />}
                                                </button>

                                                {openRoleDropdownId === member.id && (
                                                    <div className="absolute left-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                                        {(["Admin", "Support Agent"] as Role[]).map((role) => {
                                                            const cfg = roleConfig[role];
                                                            const Icon = cfg.icon;
                                                            return (
                                                                <button
                                                                    key={role}
                                                                    onClick={() => handleRoleChange(member.id, role)}
                                                                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${member.role === role ? "bg-zinc-50 dark:bg-zinc-800" : ""}`}
                                                                >
                                                                    <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                                                                    <div>
                                                                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">{role}</p>
                                                                        <p className="text-[10px] text-zinc-500">{cfg.description}</p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2 flex items-center">
                                            <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${statusCfg.bg}`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                                <span className={`text-xs font-semibold ${statusCfg.color}`}>{member.status}</span>
                                            </div>
                                        </div>

                                        {/* Last Active */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm text-zinc-500 dark:text-zinc-400">{member.lastActive}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center justify-end" onClick={e => e.stopPropagation()}>
                                            {isOwner ? (
                                                <span className="text-xs text-zinc-400">—</span>
                                            ) : (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                                                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>

                                                    {openMenuId === member.id && (
                                                        <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                                            {member.status === "Pending" && (
                                                                <button
                                                                    onClick={() => handleResend(member.id)}
                                                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                                                >
                                                                    <Send className="h-3.5 w-3.5 text-blue-500" />
                                                                    Resend Invite
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleRemoveMember(member.id)}
                                                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Remove Member
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Table Footer */}
                        <div className="border-t border-zinc-100 bg-zinc-50/50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {members.length} member{members.length !== 1 ? "s" : ""} · {members.filter(m => m.status === "Active").length} active · {members.filter(m => m.status === "Pending").length} pending
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
                    <div
                        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="mb-5 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Invite a Team Member</h2>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">They'll receive an email invitation</p>
                                </div>
                            </div>
                            <button onClick={() => setShowInviteModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="Enter email address..."
                                    className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:ring-violet-900/30"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="mb-5">
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">Role</label>
                            <div className="space-y-2">
                                {(["Admin", "Support Agent"] as Role[]).map((role) => {
                                    const cfg = roleConfig[role];
                                    const Icon = cfg.icon;
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => setInviteRole(role)}
                                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${inviteRole === role ? `${cfg.bg} ${cfg.darkBg} ${cfg.border} ring-2 ring-offset-1 ring-violet-400` : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50"}`}
                                        >
                                            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.darkBg}`}>
                                                <Icon className={`h-4 w-4 ${cfg.color}`} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${inviteRole === role ? cfg.color : "text-zinc-800 dark:text-zinc-200"}`}>{role}</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{cfg.description}</p>
                                                <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">{cfg.permissions.slice(0, 2).join(" · ")}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={handleSendInvite}
                            disabled={!inviteEmail.trim() || inviteSent}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg transition-all ${inviteSent ? "bg-emerald-500 shadow-emerald-500/30" : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50"}`}
                        >
                            {inviteSent ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Invitation Sent!
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Invitation
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
