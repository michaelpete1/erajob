import { DefineComponent } from 'vue'

type IconComponent = DefineComponent<{
  className?: string
  [key: string]: any
}>

declare module '@heroicons/vue/24/outline' {
  export const AcademicCapIcon: IconComponent
  export const AdjustmentsHorizontalIcon: IconComponent
  export const ArrowRightIcon: IconComponent
  export const BellIcon: IconComponent
  export const BriefcaseIcon: IconComponent
  export const CameraIcon: IconComponent
  export const ChartBarIcon: IconComponent
  export const ChatBubbleLeftRightIcon: IconComponent
  export const CheckCircleIcon: IconComponent
  export const ChevronRightIcon: IconComponent
  export const CodeBracketSquareIcon: IconComponent
  export const CreditCardIcon: IconComponent
  export const CurrencyDollarIcon: IconComponent
  export const DocumentTextIcon: IconComponent
  export const FilmIcon: IconComponent
  export const HomeIcon: IconComponent
  export const MegaphoneIcon: IconComponent
  export const PencilSquareIcon: IconComponent
  export const UserCircleIcon: IconComponent
  export const UserGroupIcon: IconComponent
  export const XMarkIcon: IconComponent
  
  // Fallback for any icon
  export const AnyIcon: IconComponent
}

declare module '@heroicons/vue/24/solid' {
  export const CheckCircleIcon: IconComponent
  export const MusicalNoteIcon: IconComponent
  
  // Fallback for any icon
  export const AnyIcon: IconComponent
}

// For backward compatibility with some components that might use the root import
declare module '@heroicons/vue/outline' {
  export * from '@heroicons/vue/24/outline'
}

declare module '@heroicons/vue/solid' {
  export * from '@heroicons/vue/24/solid'
}
