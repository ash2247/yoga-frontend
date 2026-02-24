import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import ContactUs from "./pages/ContactUs";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { ContentProvider } from "./context/ContentContext";

const queryClient = new QueryClient();

const App = () => (


  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ContentProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/testing" element={<Index />} />
            <Route path="/testing/" element={<Index />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
