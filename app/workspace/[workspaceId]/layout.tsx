'use client';

import { ReactNode } from "react";

import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";

type Props = {
  children: ReactNode;
};

const WorkspaceLayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="slack:workspace:layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
};

export default WorkspaceLayout;
