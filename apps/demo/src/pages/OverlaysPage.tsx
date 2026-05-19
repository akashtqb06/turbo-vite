import * as React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Separator } from "@repo/ui/components/ui/separator";
import { Badge } from "@repo/ui/components/ui/badge";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import {
  Popover, PopoverContent, PopoverTrigger,
  PopoverHeader, PopoverTitle, PopoverDescription,
} from "@repo/ui/components/ui/popover";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@repo/ui/components/ui/dropdown-menu";
import { PageHeader, SectionBlock } from "../components/PageHeader";
import { ChevronDown, Bell, Settings, Copy, Trash, Edit, Star, User } from "lucide-react";

export function OverlaysPage() {
  const [demoOpen, setDemoOpen] = React.useState(false);
  const [showNotifs, setShowNotifs] = React.useState(true);
  const [showEmail, setShowEmail] = React.useState(false);

  return (
    <div>
      <PageHeader
        title="Overlays & Popovers"
        description="Contextual UI elements — tooltips, popovers, dropdowns, and dialogs."
      />
      <div className="space-y-8">

        {/* Tooltip */}
        <SectionBlock title="Tooltips" description="Reveal extra info on hover. Ideal for icon-only buttons.">
          <TooltipProvider>
            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon"><Bell className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>Notifications (⌘N)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon"><Settings className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent>Settings (⌘,)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon"><Star className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Add to favourites</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon"><Copy className="size-4" /></Button>
                </TooltipTrigger>
                <TooltipContent side="right">Copy to clipboard</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </SectionBlock>

        <Separator />

        {/* Popover */}
        <SectionBlock title="Popover" description="Rich floating panels triggered by click.">
          <div className="flex flex-wrap gap-3">
            {/* Profile popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="size-3.5" /> View profile
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <PopoverHeader>
                  <PopoverTitle>Account details</PopoverTitle>
                  <PopoverDescription>Manage your display name and email.</PopoverDescription>
                </PopoverHeader>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8"><AvatarFallback className="text-[10px]">AK</AvatarFallback></Avatar>
                    <div>
                      <p className="text-xs font-medium">Akash Kumar</p>
                      <p className="text-[11px] text-muted-foreground">akash@example.com</p>
                    </div>
                  </div>
                  <Input placeholder="Update display name" className="mt-2" />
                  <Button size="sm" className="w-full">Save</Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Notification settings popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Bell className="size-3.5" /> Notification settings
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <PopoverHeader>
                  <PopoverTitle>Notifications</PopoverTitle>
                  <PopoverDescription>Choose what you want to hear about.</PopoverDescription>
                </PopoverHeader>
                <Separator className="my-3" />
                <div className="space-y-3">
                  {[
                    { label: "Push alerts", desc: "Deployments & errors", on: true },
                    { label: "Email digest", desc: "Weekly summary", on: false },
                    { label: "Slack DMs", desc: "Direct messages", on: true },
                  ].map(({ label, desc, on }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium">{label}</p>
                        <p className="text-[11px] text-muted-foreground">{desc}</p>
                      </div>
                      <Badge variant={on ? "default" : "outline"} className="text-[10px]">
                        {on ? "On" : "Off"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SectionBlock>

        <Separator />

        {/* Dropdown menu */}
        <SectionBlock title="Dropdown Menu" description="Contextual action menus — right-click or trigger-click patterns.">
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  Actions <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Edit className="mr-2 size-3.5" /> Edit</DropdownMenuItem>
                <DropdownMenuItem><Copy className="mr-2 size-3.5" /> Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 size-3.5" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  Preferences <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Display options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showNotifs}
                  onCheckedChange={setShowNotifs}
                >
                  Show notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showEmail}
                  onCheckedChange={setShowEmail}
                >
                  Email digests
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SectionBlock>

        <Separator />

        {/* Dialog */}
        <SectionBlock title="Dialog" description="Modal dialogs for confirmations and focused workflows.">
          <div className="flex flex-wrap gap-3">
            {/* Confirm dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete account</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete your account and all associated data.
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Yes, delete account</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Form dialog */}
            <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile. Click save when done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <Input placeholder="Display name" defaultValue="Akash Kumar" />
                  <Input placeholder="Username" defaultValue="@akash" />
                  <Input placeholder="Email" defaultValue="akash@example.com" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDemoOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDemoOpen(false)}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}
