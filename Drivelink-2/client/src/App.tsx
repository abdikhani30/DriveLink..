import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileLayout from "@/components/layout/mobile-layout";
import { VehicleProvider } from "@/contexts/vehicle-context";
import Home from "@/pages/home";
import Parking from "@/pages/parking";
import Services from "@/pages/services";
import Fines from "@/pages/fines";
import Felix from "@/pages/felix";
import More from "@/pages/more";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/parking" component={Parking} />
      <Route path="/services" component={Services} />
      <Route path="/fines" component={Fines} />
      <Route path="/felix" component={Felix} />
      <Route path="/more" component={More} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VehicleProvider>
        <TooltipProvider>
          <Toaster />
          <MobileLayout>
            <Router />
          </MobileLayout>
        </TooltipProvider>
      </VehicleProvider>
    </QueryClientProvider>
  );
}

export default App;
