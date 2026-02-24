import { createContext, useContext, ReactNode } from "react";
import { staticContent } from "@/data/staticContent";

type Content = typeof staticContent;

const ContentContext = createContext<{
    content: Content | null;
    refreshContent: () => Promise<void>;
} | null>(null);

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
    const refreshContent = async () => {
        // No-op since we're using static content now
        console.log("Static content is in use. Refresh is disabled.");
    };

    return (
        <ContentContext.Provider value={{ content: staticContent, refreshContent }}>
            {children}
        </ContentContext.Provider>
    );
};

