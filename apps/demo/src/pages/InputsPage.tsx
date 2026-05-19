import * as React from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Slider } from "@repo/ui/components/ui/slider";
import { Switch } from "@repo/ui/components/ui/switch";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import { PageHeader, SectionBlock } from "../components/PageHeader";
import { Search, Eye, EyeOff } from "lucide-react";

export function InputsPage() {
  const [sliderVal, setSliderVal] = React.useState([40]);
  const [rangeVal, setRangeVal] = React.useState([20, 75]);
  const [showPass, setShowPass] = React.useState(false);
  const [checked1, setChecked1] = React.useState(true);
  const [checked2, setChecked2] = React.useState(false);
  const [toggled, setToggled] = React.useState(true);

  return (
    <div>
      <PageHeader
        title="Inputs & Controls"
        description="Form elements — text inputs, textareas, sliders, checkboxes, and switches."
      />
      <div className="space-y-8 max-w-lg">

        <SectionBlock title="Text Input" description="Basic text input with optional prefix/suffix.">
          <div className="space-y-2">
            <Input placeholder="Default input" />
            <Input prefix={<Search className="size-3.5" />} placeholder="With search icon" />
            <Input placeholder="Disabled input" disabled />
            <div className="relative">
              <Input type={showPass ? "text" : "password"} placeholder="Password field" className="pr-9" />
              <button
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Textarea" description="Multi-line text entry.">
          <Textarea placeholder="Write your message here…" rows={4} className="resize-none" />
        </SectionBlock>

        <Separator />

        <SectionBlock
          title="Slider"
          description="Single value and range variants."
        >
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Volume</span>
                <Badge variant="outline" className="tabular-nums text-[10px]">{sliderVal[0]}%</Badge>
              </div>
              <Slider min={0} max={100} value={sliderVal} onValueChange={setSliderVal} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Price range</span>
                <Badge variant="outline" className="tabular-nums text-[10px]">${rangeVal[0]} – ${rangeVal[1]}</Badge>
              </div>
              <Slider min={0} max={100} value={rangeVal} onValueChange={setRangeVal} />
            </div>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Checkbox" description="Single and grouped checkboxes.">
          <div className="space-y-2.5">
            {[
              { id: "cb1", label: "Accept terms & conditions", state: checked1, set: setChecked1 },
              { id: "cb2", label: "Subscribe to newsletter", state: checked2, set: setChecked2 },
              { id: "cb3", label: "This option is disabled", state: false, set: () => {}, disabled: true },
            ].map(({ id, label, state, set, disabled }) => (
              <label key={id} className="flex items-center gap-2.5 text-sm cursor-pointer">
                <Checkbox
                  id={id}
                  checked={state}
                  onCheckedChange={(v) => set(Boolean(v))}
                  disabled={disabled}
                />
                <span className={disabled ? "text-muted-foreground" : ""}>{label}</span>
              </label>
            ))}
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Switch" description="Toggle on/off states.">
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch checked={toggled} onCheckedChange={setToggled} id="email-notif" />
            </label>
            <Separator />
            <label className="flex items-center justify-between cursor-pointer opacity-50">
              <div>
                <p className="text-sm font-medium">Marketing emails</p>
                <p className="text-xs text-muted-foreground">Disabled by admin</p>
              </div>
              <Switch disabled id="marketing" />
            </label>
          </div>
        </SectionBlock>

        <Separator />

        {/* Sample form */}
        <SectionBlock title="Composed Form" description="A realistic form using all input types.">
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
            </div>
            <Input prefix={<Search className="size-3.5" />} placeholder="Email address" type="email" />
            <Textarea placeholder="Tell us about yourself…" rows={3} className="resize-none" />
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <Checkbox id="agree" />
              I agree to the <span className="text-primary underline underline-offset-2">terms of service</span>
            </label>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </SectionBlock>

      </div>
    </div>
  );
}
