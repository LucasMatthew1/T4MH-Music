import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getPreviewRouterBasename } from "@/lib/previewBase";
import { AudioProvider } from "./context/AudioContext";
import { AuthProvider } from "./context/AuthContext";
import { RootLayout } from "./components/RootLayout";
import Index from "./pages/Index";
import Music from "./pages/Music";
import Composer from "./pages/Composer";
import Composition from "./pages/Composition";
import FreeUse from "./pages/FreeUse";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <AudioProvider>
        <BrowserRouter
          basename={getPreviewRouterBasename()}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RootLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/music" element={<Music />} />
              <Route path="/composer" element={<Composer />} />
              <Route path="/composition" element={<Composition />} />
              <Route path="/free-use" element={<FreeUse />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RootLayout>
        </BrowserRouter>
      </AudioProvider>
    </AuthProvider>
    <Sonner />
  </TooltipProvider>
);

export default App;
