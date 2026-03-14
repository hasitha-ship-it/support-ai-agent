// ─── Action Store — Central Definitions ───────────────────────────────────────
// Every action the chatbot can perform is defined here.
// Add new actions by extending ACTIONS_REGISTRY.

export type ActionCategory =
    | "stripe"
    | "calendly"
    | "support_tools"
    | "account_management";

export interface ConfigField {
    key: string;           // The key stored in action_configs.config JSONB
    label: string;         // UI label
    placeholder: string;   // Input placeholder
    type: "text" | "password" | "url";
    required: boolean;
}

export interface ActionDefinition {
    id: string;                    // Unique snake_case ID e.g. "stripe_process_refund"
    label: string;                 // Human-readable name
    description: string;           // What the action does
    category: ActionCategory;
    premiumOnly: boolean;          // true = not available on free_trial plan
    configFields: ConfigField[];   // API keys / config needed to use this action
    examplePrompt: string;         // Example user message that triggers this action
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const ACTIONS_REGISTRY: ActionDefinition[] = [
    // ── Stripe ──────────────────────────────────────────────────────────────
    {
        id: "stripe_process_refund",
        label: "Process Refund",
        description: "Issue a full or partial refund for a customer's payment via Stripe.",
        category: "stripe",
        premiumOnly: false,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "I want a refund for my last payment.",
    },
    {
        id: "stripe_check_subscription",
        label: "Check Subscription Status",
        description: "Look up a customer's active subscription, plan, and renewal date.",
        category: "stripe",
        premiumOnly: false,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "What plan am I on? When does my subscription renew?",
    },
    {
        id: "stripe_cancel_subscription",
        label: "Cancel Subscription",
        description: "Cancel a customer's Stripe subscription at end of billing period.",
        category: "stripe",
        premiumOnly: true,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "Please cancel my subscription.",
    },
    {
        id: "stripe_update_payment_method",
        label: "Update Payment Method",
        description: "Send a customer a secure link to update their card or payment method.",
        category: "stripe",
        premiumOnly: false,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "I need to update my credit card.",
    },
    {
        id: "stripe_send_invoice_email",
        label: "Send Invoice Email",
        description: "Re-send the latest Stripe invoice to the customer's email.",
        category: "stripe",
        premiumOnly: false,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "Can you send me my invoice again?",
    },
    {
        id: "stripe_check_transactions",
        label: "Check Past Transactions",
        description: "List the customer's recent payment history and amounts.",
        category: "stripe",
        premiumOnly: false,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "Show me my last 5 payments.",
    },
    {
        id: "stripe_create_payment_link",
        label: "Create Payment Link",
        description: "Generate a Stripe payment link for a specific product or amount.",
        category: "stripe",
        premiumOnly: true,
        configFields: [
            { key: "stripe_api_key", label: "Stripe Restricted API Key", placeholder: "rk_live_...", type: "password", required: true },
        ],
        examplePrompt: "Create a payment link for the Pro plan.",
    },

    // ── Calendly ─────────────────────────────────────────────────────────────
    {
        id: "calendly_book_meeting",
        label: "Book Meeting",
        description: "Let customers book a meeting directly through the chat.",
        category: "calendly",
        premiumOnly: true,
        configFields: [
            { key: "calendly_api_key", label: "Calendly Personal Access Token", placeholder: "eyJra...", type: "password", required: true },
            { key: "calendly_user_uri", label: "Calendly User URI", placeholder: "https://api.calendly.com/users/...", type: "url", required: true },
        ],
        examplePrompt: "I'd like to schedule a demo call.",
    },
    {
        id: "calendly_check_availability",
        label: "Check Availability",
        description: "Show available time slots from your Calendly calendar.",
        category: "calendly",
        premiumOnly: true,
        configFields: [
            { key: "calendly_api_key", label: "Calendly Personal Access Token", placeholder: "eyJra...", type: "password", required: true },
        ],
        examplePrompt: "When are you available this week?",
    },
    {
        id: "calendly_reschedule_meeting",
        label: "Reschedule Meeting",
        description: "Help a customer move an existing Calendly appointment to a new time.",
        category: "calendly",
        premiumOnly: true,
        configFields: [
            { key: "calendly_api_key", label: "Calendly Personal Access Token", placeholder: "eyJra...", type: "password", required: true },
        ],
        examplePrompt: "I need to move my meeting to next Thursday.",
    },
    {
        id: "calendly_cancel_meeting",
        label: "Cancel Meeting",
        description: "Cancel a scheduled Calendly event on behalf of the customer.",
        category: "calendly",
        premiumOnly: true,
        configFields: [
            { key: "calendly_api_key", label: "Calendly Personal Access Token", placeholder: "eyJra...", type: "password", required: true },
        ],
        examplePrompt: "Please cancel my meeting tomorrow.",
    },
    {
        id: "calendly_get_event_types",
        label: "Get Event Types",
        description: "List all available meeting types from your Calendly profile.",
        category: "calendly",
        premiumOnly: true,
        configFields: [
            { key: "calendly_api_key", label: "Calendly Personal Access Token", placeholder: "eyJra...", type: "password", required: true },
        ],
        examplePrompt: "What kinds of calls can I book?",
    },
    {
        id: "calendly_list_upcoming_events",
        label: "List Upcoming Events",
        description: "Show a customer all their upcoming scheduled meetings.",
        category: "calendly",
        premiumOnly: true,
        configFields: [
            { key: "calendly_api_key", label: "Calendly Personal Access Token", placeholder: "eyJra...", type: "password", required: true },
        ],
        examplePrompt: "What meetings do I have coming up?",
    },

    // ── Support Tools ─────────────────────────────────────────────────────────
    {
        id: "support_report_bug",
        label: "Report a Bug",
        description: "Let customers describe a bug — creates a Jira/GitHub ticket automatically.",
        category: "support_tools",
        premiumOnly: false,
        configFields: [],
        examplePrompt: "I found a bug — the checkout button doesn't work.",
    },
    {
        id: "support_search_web",
        label: "Search Web",
        description: "Search the web for real-time answers when the knowledge base doesn't have them.",
        category: "support_tools",
        premiumOnly: true,
        configFields: [],
        examplePrompt: "What's the latest version of your product?",
    },
    {
        id: "support_check_request_status",
        label: "Check My Request Status",
        description: "Let customers track the status of their submitted support ticket or request.",
        category: "support_tools",
        premiumOnly: false,
        configFields: [],
        examplePrompt: "What's the status of my ticket #12345?",
    },
    {
        id: "support_send_slack_alert",
        label: "Send Slack Alert",
        description: "Notify your team on Slack when a conversation needs urgent attention.",
        category: "support_tools",
        premiumOnly: true,
        configFields: [
            { key: "slack_webhook_url", label: "Slack Webhook URL", placeholder: "https://hooks.slack.com/services/...", type: "url", required: true },
        ],
        examplePrompt: "This customer needs urgent help — alert the team.",
    },
    {
        id: "support_escalate_to_human",
        label: "Escalate to Human",
        description: "Hand off the chat to a human agent when the bot can't resolve the issue.",
        category: "support_tools",
        premiumOnly: false,
        configFields: [],
        examplePrompt: "I need to speak to a real person.",
    },

    // ── Account Management ────────────────────────────────────────────────────
    {
        id: "account_send_password_reset",
        label: "Send Password Reset",
        description: "Trigger a password reset email for the customer's account.",
        category: "account_management",
        premiumOnly: false,
        configFields: [],
        examplePrompt: "I forgot my password. Can you send a reset link?",
    },
    {
        id: "account_unlock_user",
        label: "Unlock User Account",
        description: "Re-enable a locked or banned user account.",
        category: "account_management",
        premiumOnly: true,
        configFields: [],
        examplePrompt: "My account has been locked, please unlock it.",
    },
    {
        id: "account_update_email",
        label: "Update Email Address",
        description: "Send a confirmation flow to update the customer's account email.",
        category: "account_management",
        premiumOnly: false,
        configFields: [],
        examplePrompt: "I want to change my email address.",
    },
    {
        id: "account_enable_2fa",
        label: "Enable 2FA Enforcement",
        description: "Force two-factor authentication on a user account for security.",
        category: "account_management",
        premiumOnly: true,
        configFields: [],
        examplePrompt: "Enable two-factor authentication on my account.",
    },
    {
        id: "account_revoke_sessions",
        label: "Revoke Active Sessions",
        description: "Sign out all active sessions for a user to secure their account.",
        category: "account_management",
        premiumOnly: true,
        configFields: [],
        examplePrompt: "Someone else might be using my account — sign out all devices.",
    },
    {
        id: "account_delete_user",
        label: "Delete User Account",
        description: "Permanently delete a user's account and all associated data.",
        category: "account_management",
        premiumOnly: true,
        configFields: [],
        examplePrompt: "I want to delete my account permanently.",
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Look up a single action by id. */
export function getAction(id: string): ActionDefinition | undefined {
    return ACTIONS_REGISTRY.find((a) => a.id === id);
}

/** Get all actions for a given category. */
export function getActionsByCategory(category: ActionCategory): ActionDefinition[] {
    return ACTIONS_REGISTRY.filter((a) => a.category === category);
}

/** Category metadata for UI rendering. */
export const CATEGORY_META: Record<ActionCategory, { label: string; emoji: string; description: string }> = {
    stripe: {
        label: "Stripe Payments",
        emoji: "💳",
        description: "Process refunds, manage subscriptions, and handle payments",
    },
    calendly: {
        label: "Calendly (Sales)",
        emoji: "📅",
        description: "Book meetings, check availability, and manage appointments",
    },
    support_tools: {
        label: "Support Tools",
        emoji: "🛠️",
        description: "Escalate issues, alert your team, and search for answers",
    },
    account_management: {
        label: "Account Management",
        emoji: "👤",
        description: "Reset passwords, manage user accounts, and handle security",
    },
};
