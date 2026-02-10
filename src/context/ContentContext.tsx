import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getContent } from "@/services/api";

type Content = {
    hero: { slides: string[] };
    video: { title: string; src: string };
    classes: any[];
    reviews: any[];
    timetable: any[];
    blogs: any[];
    about: {
        content?: string;
        name?: string;
        title?: string;
        image?: string;
        bio?: string;
    };
};

const ContentContext = createContext<{
    content: Content | null;
    refreshContent: () => Promise<void>;
} | null>(null);

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
    const [content, setContent] = useState<Content | null>(null);

    const refreshContent = async () => {
        try {
            const freshContent = await getContent();
            setContent(freshContent);
        } catch (error) {
            console.error('Failed to refresh content:', error);
        }
    };

    useEffect(() => {
        refreshContent();
    }, []);

    return (
        <ContentContext.Provider value={{ content, refreshContent }}>
            {children}
        </ContentContext.Provider>
    );
};
