import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import { MobileSidebar } from "./mobile-sidebar"
import FormPopOver from "@/components/form/form-popover"

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4  w-full h-14 border-b shadow-sm bg-white flex items-center">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopOver align="start" side="bottom" sideOffset={18}>
          <Button
            size="sm"
            variant="primary"
            className="rounded-sm hidden md:block py-1.5 h-auto px-2"
          >
            Create
          </Button>
        </FormPopOver>

        <FormPopOver>
          <Button
            size={"sm"}
            className="rounded-sm block md:hidden"
            variant={"primary"}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </FormPopOver>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl={"/organization/:id"}
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl={"/organization/:id"}
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  )
}
