// ─── Shared UI Config Type ────────────────────────────────────────────────────
//
// Used by:
//  • /api/bot/update-ui  (save/load)
//  • /api/widget/[botId]/config  (public widget config endpoint)
//  • ui-setup/page.tsx  (frontend form)

export interface UiConfig {
    agentName: string;
    primaryColor: string;
    themeMode: "light" | "dark" | "auto";
    /** Emoji string (e.g. "🤖") or image path (e.g. "/Agent-avatar.png") */
    avatar: string;
    launcherStyle: "bubble" | "agent" | "brand";
    brandLogoUrl: string | null;
    welcomeMessage: string;
    /** Array of action IDs chosen for Quick Action chips */
    quickActions: string[];
    showTypingIndicator: boolean;
}

export const DEFAULT_UI_CONFIG: UiConfig = {
    agentName: "Support Agent",
    primaryColor: "#7c3aed",
    themeMode: "auto",
    avatar: "🤖",
    launcherStyle: "bubble",
    brandLogoUrl: null,
    welcomeMessage: "👋 Hi! I'm your AI assistant. How can I help you today?",
    quickActions: [],
    showTypingIndicator: true,
};
