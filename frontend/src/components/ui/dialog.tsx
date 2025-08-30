"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Create a custom dialog root that manages smooth animations
interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dialog({ children, open, onOpenChange }: DialogProps) {
  const [animationState, setAnimationState] = React.useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [shouldRender, setShouldRender] = React.useState(false)
  
  React.useEffect(() => {
    if (open) {
      // Show dialog immediately
      setShouldRender(true)
      setAnimationState('opening')
      
      // Fast, buttery smooth animation trigger
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationState('open')
        })
      })
    } else if (shouldRender) {
      // Start closing animation
      setAnimationState('closing')
      
      // Hide dialog after ultra fast close animation
      setTimeout(() => {
        setShouldRender(false)
        setAnimationState('closed')
      }, 120) // Ultra fast close timing
    }
  }, [open, shouldRender])
  
  // Always call onOpenChange when we want to close
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }, [onOpenChange])
  
  return (
    <DialogPrimitive.Root open={shouldRender} onOpenChange={handleOpenChange}>
      <DialogProvider value={{ isAnimating: shouldRender, animationState }}>
        {children}
      </DialogProvider>
    </DialogPrimitive.Root>
  )
}

// Enhanced dialog context with animation states
const DialogContext = React.createContext<{ 
  isAnimating: boolean
  animationState: 'closed' | 'opening' | 'open' | 'closing'
}>({ 
  isAnimating: false,
  animationState: 'closed'
})
const DialogProvider = DialogContext.Provider
const useDialogContext = () => React.useContext(DialogContext)

const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  const { animationState } = useDialogContext()
  
  // ULTRA FAST & SILKY SMOOTH animations!
  const getOverlayClasses = () => {
    switch (animationState) {
      case 'opening':
        return "opacity-0 transition-opacity duration-100 ease-out"
      case 'open':
        return "opacity-100 transition-opacity duration-100 ease-out"
      case 'closing':
        return "opacity-0 transition-opacity duration-120 ease-in" // Ultra fast close
      default:
        return "opacity-100"
    }
  }
  
  const getContentClasses = () => {
    switch (animationState) {
      case 'opening':
        return "opacity-0 scale-80 rotate-[-1deg] translate-x-[-50%] translate-y-[-45%] transition-all duration-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]" // Ultra smooth spring
      case 'open':
        return "opacity-100 scale-100 rotate-0 translate-x-[-50%] translate-y-[-50%] transition-all duration-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]" // SILKY JIGGLE BOUNCE!
      case 'closing':
        return "opacity-0 scale-88 rotate-[0.5deg] translate-x-[-50%] translate-y-[-42%] transition-all duration-120 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" // ULTRA SMOOTH close
      default:
        return "opacity-100 scale-100 rotate-0 translate-x-[-50%] translate-y-[-50%]"
    }
  }
  
  return (
    <DialogPortal>
      <DialogPrimitive.Overlay asChild>
        <div 
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity",
            getOverlayClasses()
          )}
        />
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content asChild {...props}>
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 flex flex-col w-full max-w-lg gap-6 rounded-xl border py-6 px-6 shadow-lg focus:outline-none transition-all",
            "bg-card text-card-foreground border-border",
            getContentClasses(),
            className
          )}
          style={{
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            borderColor: 'hsl(var(--border))'
          }}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute top-4 ltr:right-4 rtl:left-4 rounded-sm p-1 text-muted-foreground transition-all duration-150 hover:text-foreground hover:bg-muted hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:ltr:text-left sm:rtl:text-right", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row ltr:sm:justify-end rtl:sm:justify-start",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold rtl:text-right ltr:text-left", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm rtl:text-right ltr:text-left", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
