"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
    Bell, Check, Lock,
    AlertTriangle, Copy, ExternalLink, Zap, Users2, Database, Shield, Plus
} from "lucide-react";
import { Sidebar, useSidebarState } from "@/components/sidebar";

const allAgents = [
    { id: "wn_abc123xyz", name: "Customer Support Bot", status: "active", theme: "#7c3aed", initials: "CS" },
    { id: "wn_def456uvw", name: "Sales Assistant", status: "active", theme: "#3b82f6", initials: "SA" },
    { id: "wn_ghi789rst", name: "Product Expert", status: "paused", theme: "#10b981", initials: "PE" },
];

const integrations = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Process refunds, manage subscriptions, and handle payments",
        logo: "https://cdn.brandfetch.io/stripe.com/w/400/h/400",
        color: "#635BFF",
        connected: false,
    },
    {
        id: "paypal",
        name: "PayPal",
        description: "Handle transactions, disputes, and customer payments",
        logo: "https://cdn.brandfetch.io/paypal.com/w/400/h/400",
        color: "#0070BA",
        connected: false,
    },
    {
        id: "paddle",
        name: "Paddle",
        description: "Manage billing, subscriptions, and customer portals",
        logo: "https://cdn.brandfetch.io/paddle.com/w/400/h/400",
        color: "#7000FF",
        connected: false,
    },
];

const databaseIntegrations = [
    {
        id: "supabase",
        name: "Supabase",
        description: "Manage users, reset passwords, and handle authentication",
        logo: "https://cdn.brandfetch.io/supabase.com/w/400/h/400",
        color: "#3ECF8E",
        connected: false,
    },
    {
        id: "firebase",
        name: "Firebase",
        description: "Lock/unlock users, revoke sessions, and manage auth",
        logo: "https://cdn.brandfetch.io/firebase.google.com/w/400/h/400",
        color: "#FFCA28",
        connected: false,
    },
];

const supportIntegrations = [
    {
        id: "jira",
        name: "Jira",
        description: "Automatically create tickets, bugs, and tasks from conversations",
        logo: "https://cdn.brandfetch.io/atlassian.com/w/400/h/400",
        color: "#0052CC",
        connected: false,
    },
    {
        id: "slack",
        name: "Slack",
        description: "Send notifications and messages to Slack channels",
        logo: "https://cdn.brandfetch.io/slack.com/w/400/h/400",
        color: "#4A154B",
        connected: false,
    },
    {
        id: "zendesk",
        name: "Zendesk",
        description: "Manage support tickets and sync chat history",
        logo: "https://cdn.brandfetch.io/zendesk.com/w/400/h/400",
        color: "#03363D",
        connected: false,
    },
];

export default function IntegrationHubPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [agentsSubmenuOpen, setAgentsSubmenuOpen] = React.useState(true);
    const [selectedIntegration, setSelectedIntegration] = React.useState<string | null>(null);
    const [apiKey, setApiKey] = React.useState("");
    const [jiraStep, setJiraStep] = React.useState(1);
    const [jiraVerified, setJiraVerified] = React.useState(false);
    const [jiraSiteUrl, setJiraSiteUrl] = React.useState("");
    const [jiraEmail, setJiraEmail] = React.useState("");
    const [jiraApiToken, setJiraApiToken] = React.useState("");
    const [jiraProject, setJiraProject] = React.useState("");
    const [jiraIssueType, setJiraIssueType] = React.useState("");
    const [slackWebhookUrl, setSlackWebhookUrl] = React.useState("");
    const [zendeskSubdomain, setZendeskSubdomain] = React.useState("");
    const [zendeskEmail, setZendeskEmail] = React.useState("");
    const [zendeskApiToken, setZendeskApiToken] = React.useState("");
    const [zendeskCreateTickets, setZendeskCreateTickets] = React.useState(true);
    const [zendeskCheckStatus, setZendeskCheckStatus] = React.useState(true);
    const [zendeskSyncHistory, setZendeskSyncHistory] = React.useState(true);
    const [copied, setCopied] = React.useState(false);

    const currentAgent = allAgents.find(a => a.id === agentId) || allAgents[0];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderStripeModal = () => (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Setup Instructions</h3>
                {[
                    "Log in to your Stripe Dashboard",
                    "Go to Developers > API Keys",
                    "Click 'Create Restricted Key'",
                    "Name it 'WizName Bot'"
                ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                            {i + 1}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <h4 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">Required Permissions</h4>
                    <div className="space-y-2 text-xs">
                        <p className="font-semibold text-zinc-700 dark:text-zinc-300">Set to Write:</p>
                        {["Refunds", "Payment Links", "Subscriptions", "Customers"].map(p => (
                            <div key={p} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-600" />
                                <span className="text-zinc-600 dark:text-zinc-400">{p}: Write</span>
                            </div>
                        ))}
                        <p className="mt-3 font-semibold text-zinc-700 dark:text-zinc-300">Set to Read:</p>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-600" />
                            <span className="text-zinc-600 dark:text-zinc-400">Products & Prices: Read</span>
                        </div>
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                            <span className="text-amber-900 dark:text-amber-200">Leave "Payouts" as None</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        <Lock className="mb-1 inline h-4 w-4" /> Restricted API Key
                    </label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="rk_live_********************"
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                    />
                </div>
            </div>
        </div>
    );

    const renderPayPalModal = () => (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Setup Instructions</h3>
                {[
                    "Log in to PayPal Developer Dashboard",
                    "Go to Apps & Credentials > Create App",
                    "Name it: WizName Support Bot",
                    "Enable required features"
                ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30">
                            {i + 1}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <h4 className="mb-3 text-sm font-bold">App Features (Check these)</h4>
                    {["Transaction Search", "Customer Disputes", "Accept Payments"].map(f => (
                        <div key={f} className="mb-2 flex items-center gap-2 text-xs">
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span className="text-zinc-600 dark:text-zinc-400">{f}</span>
                        </div>
                    ))}
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                        <span className="text-xs text-amber-900 dark:text-amber-200">Do NOT enable "Payouts"</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="mb-2 block text-sm font-bold">Client ID</label>
                        <input type="text" placeholder="AXxxx..." className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-bold">Client Secret</label>
                        <input type="password" placeholder="EXxxx..." className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPaddleModal = () => (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                <h3 className="text-lg font-bold">Setup Instructions</h3>
                {[
                    "Go to Developer Tools > API Keys",
                    "Create a new key",
                    "Set specific permissions",
                    "Copy the API key"
                ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900/30">
                            {i + 1}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <h4 className="mb-3 text-sm font-bold">Required Permissions</h4>
                    <div className="space-y-2 text-xs">
                        {[
                            { name: "Customers", perm: "Read & Write" },
                            { name: "Transactions", perm: "Read & Write" },
                            { name: "Subscriptions", perm: "Read & Write" },
                            { name: "Products/Prices", perm: "Read Only" },
                            { name: "Customer Portal", perm: "Write" }
                        ].map(item => (
                            <div key={item.name} className="flex justify-between">
                                <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
                                <span className="font-semibold text-violet-600 dark:text-violet-400">{item.perm}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold">API Key</label>
                    <input type="text" placeholder="pdl_live_..." className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900" />
                </div>
            </div>
        </div>
    );

    const supabaseSQL = `-- 1. Create a secure function to manage users
CREATE OR REPLACE FUNCTION wizname_manage_user(
    action_type text,
    target_email text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_id uuid;
BEGIN
    SELECT id INTO target_id FROM auth.users WHERE email = target_email;
    IF target_id IS NULL THEN
        RETURN json_build_object('error', 'User not found');
    END IF;
    
    IF action_type = 'reset_password' THEN
        RETURN json_build_object('status', 'Use Supabase Auth API');
    ELSIF action_type = 'unlock_user' THEN
        UPDATE auth.users SET banned_until = NULL WHERE id = target_id;
        RETURN json_build_object('success', 'User unlocked');
    ELSIF action_type = 'revoke_sessions' THEN
        UPDATE auth.users SET raw_app_meta_data = 
            raw_app_meta_data || jsonb_build_object('provider', 'email') 
            WHERE id = target_id;
        RETURN json_build_object('success', 'Sessions revoked');
    ELSIF action_type = 'confirm_email' THEN
        UPDATE auth.users SET email_confirmed_at = now() WHERE id = target_id;
        RETURN json_build_object('success', 'Email confirmed');
    ELSE
        RETURN json_build_object('error', 'Invalid action');
    END IF;
END;
$$;

-- 2. Grant permissions
GRANT EXECUTE ON FUNCTION wizname_manage_user TO anon;
GRANT EXECUTE ON FUNCTION wizname_manage_user TO authenticated;
GRANT EXECUTE ON FUNCTION wizname_manage_user TO service_role;`;

    const firebaseCode = `const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();

exports.wiznameAction = functions.https.onRequest(async (req, res) => {
  const secret = req.body.secret;
  const MY_SECRET = "CHANGE_THIS_PASSWORD";
  
  if (secret !== MY_SECRET) return res.status(403).send("Unauthorized");
  
  const { action, email } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (action === "unlock") await admin.auth().updateUser(user.uid, { disabled: false });
    else if (action === "lock") await admin.auth().updateUser(user.uid, { disabled: true });
    else if (action === "revoke") await admin.auth().revokeRefreshTokens(user.uid);
    res.json({ success: true });
  } catch (e) { res.status(500).send(e.message); }
});`;

    const renderSupabaseModal = () => (
        <div className="grid gap-6 lg:grid-cols-[40%_60%]">
            {/* Left Column - Instructions (Vertically Centered) */}
            <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Setup Instructions</h3>
                {[
                    "Copy the SQL code below",
                    "Run it in your Supabase SQL Editor",
                    "Enter your Anon Key below"
                ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30">
                            {i + 1}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                    </div>
                ))}
            </div>

            {/* Right Column - Code & Input (60% width) */}
            <div className="space-y-4">
                <div className="rounded-xl border-2 border-zinc-200 bg-zinc-900 p-4 dark:border-zinc-800">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400">SQL Code</span>
                        <button
                            onClick={() => copyToClipboard(supabaseSQL)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                            <Copy className="h-3 w-3" />
                            {copied ? "Copied!" : "Copy SQL"}
                        </button>
                    </div>
                    <pre className="max-h-64 overflow-y-auto text-xs text-emerald-400">
                        <code>{supabaseSQL}</code>
                    </pre>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        <Lock className="mb-1 inline h-4 w-4" /> Anon Key
                    </label>
                    <input
                        type="text"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                    />
                </div>
            </div>
        </div>
    );

    const renderFirebaseModal = () => (
        <div className="grid gap-6 lg:grid-cols-[40%_60%]">
            {/* Left Column - Instructions (Vertically Centered) */}
            <div className="flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Setup Instructions</h3>
                {[
                    "Copy code and paste into functions/index.js",
                    "Deploy: firebase deploy --only functions:wiznameAction",
                    "Enter Function URL and Secret below"
                ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600 dark:bg-amber-900/30">
                            {i + 1}
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                    </div>
                ))}
            </div>

            {/* Right Column - Code & Inputs (60% width) */}
            <div className="space-y-4">
                <div className="rounded-xl border-2 border-zinc-200 bg-zinc-900 p-4 dark:border-zinc-800">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-400">Firebase Function Code</span>
                        <button
                            onClick={() => copyToClipboard(firebaseCode)}
                            className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700"
                        >
                            <Copy className="h-3 w-3" />
                            {copied ? "Copied!" : "Copy Code"}
                        </button>
                    </div>
                    <pre className="max-h-64 overflow-y-auto text-xs text-amber-400">
                        <code>{firebaseCode}</code>
                    </pre>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">Function URL</label>
                        <input type="text" placeholder="https://.../wiznameAction" className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">Secret Password</label>
                        <input type="password" placeholder="CHANGE_THIS_PASSWORD" className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJiraModal = () => {
        const handleVerifyConnection = () => {
            // Simulate API verification
            if (jiraSiteUrl && jiraEmail && jiraApiToken) {
                setJiraVerified(true);
                setJiraStep(2);
            }
        };

        return (
            <div className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3">
                    <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${jiraStep === 1
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        }`}>
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${jiraStep === 1 ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                            }`}>
                            {jiraVerified ? "✓" : "1"}
                        </div>
                        Authentication
                    </div>
                    <div className="h-0.5 w-12 bg-zinc-200 dark:bg-zinc-700" />
                    <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${jiraStep === 2
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${jiraStep === 2 ? "bg-blue-600 text-white" : "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                            }`}>
                            2
                        </div>
                        Configuration
                    </div>
                </div>

                {/* Step 1: Authentication */}
                {jiraStep === 1 && (
                    <div className="space-y-5">
                        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-200">
                                🔐 Authentication Required
                            </h3>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Enter your Jira credentials to connect your account. We'll verify the connection before proceeding.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Jira Site URL */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    Jira Site URL
                                </label>
                                <input
                                    type="text"
                                    value={jiraSiteUrl}
                                    onChange={(e) => setJiraSiteUrl(e.target.value)}
                                    placeholder="https://yourcompany.atlassian.net"
                                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                                />
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    The web address you use to log in to Jira.
                                </p>
                            </div>

                            {/* Account Email */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    Account Email
                                </label>
                                <input
                                    type="email"
                                    value={jiraEmail}
                                    onChange={(e) => setJiraEmail(e.target.value)}
                                    placeholder="admin@company.com"
                                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                                />
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    The email address associated with your Jira account.
                                </p>
                            </div>

                            {/* API Token */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    <Lock className="mb-1 inline h-4 w-4" /> API Token (⚠️ Not your password!)
                                </label>
                                <input
                                    type="password"
                                    value={jiraApiToken}
                                    onChange={(e) => setJiraApiToken(e.target.value)}
                                    placeholder="Paste your API token here"
                                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                                />
                                <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                                    <div className="text-xs text-amber-900 dark:text-amber-200">
                                        <p className="font-semibold mb-1">How to create an API Token:</p>
                                        <ol className="list-decimal list-inside space-y-0.5">
                                            <li>Go to Security → Create and manage API tokens</li>
                                            <li>Click "Create API token"</li>
                                            <li>Copy and paste it here</li>
                                        </ol>
                                        <a
                                            href="https://id.atlassian.com/manage-profile/security/api-tokens"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                                        >
                                            Create a new API Token <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={handleVerifyConnection}
                            disabled={!jiraSiteUrl || !jiraEmail || !jiraApiToken}
                            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Verify Connection
                        </Button>
                    </div>
                )}

                {/* Step 2: Configuration */}
                {jiraStep === 2 && (
                    <div className="space-y-5">
                        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                ✅ Connection Verified!
                            </h3>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                Your Jira account is connected. Now configure where the bot should create tickets.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Select Project */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    Select Project
                                </label>
                                <select
                                    value={jiraProject}
                                    onChange={(e) => setJiraProject(e.target.value)}
                                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                                >
                                    <option value="">Choose a project...</option>
                                    <option value="SUP">Support Team (SUP)</option>
                                    <option value="DEV">Development (DEV)</option>
                                    <option value="OPS">Operations (OPS)</option>
                                </select>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Where should the bot create tickets?
                                </p>
                            </div>

                            {/* Select Issue Type */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    Default Issue Type
                                </label>
                                <select
                                    value={jiraIssueType}
                                    onChange={(e) => setJiraIssueType(e.target.value)}
                                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                                >
                                    <option value="">Choose issue type...</option>
                                    <option value="bug">🐛 Bug</option>
                                    <option value="task">📋 Task</option>
                                    <option value="story">📖 Story</option>
                                </select>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    Default ticket type for new issues
                                </p>
                            </div>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setJiraStep(1);
                                setJiraVerified(false);
                            }}
                            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            ← Back to Authentication
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderSlackModal = () => {
        return (
            <div className="grid gap-6 lg:grid-cols-[40%_60%]">
                {/* Left Column - Instructions (Vertically Centered) */}
                <div className="flex flex-col justify-center space-y-4">
                    <div className="mb-4">
                        <img
                            src="https://cdn.brandfetch.io/slack.com/w/400/h/400"
                            alt="Slack"
                            className="h-20 w-20 object-contain"
                        />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Setup Instructions</h3>
                    <div className="space-y-3">
                        {[
                            "Go to your Slack workspace",
                            "Click on your workspace name → Settings & administration → Manage apps",
                            "Search for 'Incoming Webhooks' and add it",
                            "Choose a channel to post to",
                            "Copy the Webhook URL",
                            "Paste it in the field on the right"
                        ].map((step, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{step}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-xl border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-purple-900 dark:text-purple-200">
                            💡 What is a Webhook URL?
                        </h4>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                            A webhook URL allows the bot to send messages directly to your Slack channel. It's a secure way to integrate without needing full Slack API access.
                        </p>
                    </div>
                </div>

                {/* Right Column - Input Field (60% width) */}
                <div className="flex flex-col justify-center space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            <Zap className="mb-1 inline h-4 w-4" /> Webhook URL
                        </label>
                        <input
                            type="text"
                            value={slackWebhookUrl}
                            onChange={(e) => setSlackWebhookUrl(e.target.value)}
                            placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX"
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                        />
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            This is how the bot will send messages to Slack.
                        </p>
                    </div>

                    <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                        <h4 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">Example Webhook URL Format:</h4>
                        <div className="rounded-lg bg-zinc-900 p-3">
                            <code className="text-xs text-emerald-400 break-all">
                                https://hooks.slack.com/services/
                                <br />
                                T00000000/B00000000/
                                <br />
                                XXXXXXXXXXXXXXXXXXXX
                            </code>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                        <div className="text-xs text-amber-900 dark:text-amber-200">
                            <p className="font-semibold mb-1">Keep your webhook URL secure!</p>
                            <p>Anyone with this URL can post messages to your Slack channel. Don't share it publicly.</p>
                        </div>
                    </div>

                    <a
                        href="https://api.slack.com/messaging/webhooks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                        Learn more about Slack Webhooks <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
            </div>
        );
    };

    const renderZendeskModal = () => {
        return (
            <div className="space-y-6">
                {/* Configuration Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Configuration</h3>

                    {/* Subdomain */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Subdomain
                        </label>
                        <input
                            type="text"
                            value={zendeskSubdomain}
                            onChange={(e) => setZendeskSubdomain(e.target.value)}
                            placeholder="mycompany"
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                        />
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            e.g., mycompany.zendesk.com
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Email
                        </label>
                        <input
                            type="email"
                            value={zendeskEmail}
                            onChange={(e) => setZendeskEmail(e.target.value)}
                            placeholder="admin@company.com"
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                        />
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Your Zendesk account email
                        </p>
                    </div>

                    {/* API Token */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            <Lock className="mb-1 inline h-4 w-4" /> API Token
                        </label>
                        <input
                            type="password"
                            value={zendeskApiToken}
                            onChange={(e) => setZendeskApiToken(e.target.value)}
                            placeholder="Paste your API token here"
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                        />
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Access your API token from Zendesk Admin Center
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-200">
                        ℹ️ How to get your API Token
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700 dark:text-blue-300">
                        <li>Go to Zendesk Admin Center</li>
                        <li>Navigate to Apps and integrations → APIs → Zendesk API</li>
                        <li>Click "Add API token"</li>
                        <li>Copy the token and paste it above</li>
                    </ol>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="integrations" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            <main className={mainClass}>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: currentAgent.theme }}>
                            {currentAgent.initials}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{currentAgent.name} - Integration Hub</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Connect payment providers and tools</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="rounded-xl bg-zinc-100 p-2.5 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <ThemeToggle />
                    </div>
                </header>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Payment Integrations</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Connect your payment providers to enable automated actions</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {integrations.map((integration) => (
                            <button
                                key={integration.id}
                                onClick={() => setSelectedIntegration(integration.id)}
                                className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 text-left transition-all hover:border-violet-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-violet-800"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
                                        <img src={integration.logo} alt={integration.name} className="h-full w-full object-contain" />
                                    </div>
                                    <div className={`rounded-full px-3 py-1 text-xs font-bold ${integration.connected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                                        {integration.connected ? "Connected" : "Not Connected"}
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{integration.name}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{integration.description}</p>
                            </button>
                        ))}
                    </div>

                    {/* Database Integrations Section */}
                    <div className="mb-6 mt-12">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Database Integrations</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Connect your database to manage users and authentication</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {databaseIntegrations.map((integration) => (
                            <button
                                key={integration.id}
                                onClick={() => setSelectedIntegration(integration.id)}
                                className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 text-left transition-all hover:border-violet-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-violet-800"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
                                        <img src={integration.logo} alt={integration.name} className="h-full w-full object-contain" />
                                    </div>
                                    <div className={`rounded-full px-3 py-1 text-xs font-bold ${integration.connected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                                        {integration.connected ? "Connected" : "Not Connected"}
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{integration.name}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{integration.description}</p>
                            </button>
                        ))}
                    </div>

                    {/* Support Integrations Section */}
                    <div className="mb-6 mt-12">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Support Integrations</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Connect your ticketing and project management tools</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {supportIntegrations.map((integration) => (
                            <button
                                key={integration.id}
                                onClick={() => setSelectedIntegration(integration.id)}
                                className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 text-left transition-all hover:border-violet-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-violet-800"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
                                        <img src={integration.logo} alt={integration.name} className="h-full w-full object-contain" />
                                    </div>
                                    <div className={`rounded-full px-3 py-1 text-xs font-bold ${integration.connected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                                        {integration.connected ? "Connected" : "Not Connected"}
                                    </div>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{integration.name}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{integration.description}</p>
                            </button>
                        ))}
                    </div>

                    {selectedIntegration && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
                            onClick={() => setSelectedIntegration(null)}
                        >
                            <div
                                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 my-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        Connect {[...integrations, ...databaseIntegrations, ...supportIntegrations].find(i => i.id === selectedIntegration)?.name}
                                    </h2>
                                    <button onClick={() => setSelectedIntegration(null)} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <span className="text-2xl">×</span>
                                    </button>
                                </div>
                                {selectedIntegration === "stripe" && renderStripeModal()}
                                {selectedIntegration === "paypal" && renderPayPalModal()}
                                {selectedIntegration === "paddle" && renderPaddleModal()}
                                {selectedIntegration === "supabase" && renderSupabaseModal()}
                                {selectedIntegration === "firebase" && renderFirebaseModal()}
                                {selectedIntegration === "jira" && renderJiraModal()}
                                {selectedIntegration === "slack" && renderSlackModal()}
                                {selectedIntegration === "zendesk" && renderZendeskModal()}
                                <div className="mt-6 flex justify-end gap-3">
                                    <Button onClick={() => setSelectedIntegration(null)} className="rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300">
                                        Cancel
                                    </Button>
                                    <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                                        Connect Integration
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
