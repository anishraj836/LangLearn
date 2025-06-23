import { LoaderIcon } from 'lucide-react'
import React from 'react'
import useThemeStore from '../store/useThemeStore';

function PageLoader() {
    const { theme } = useThemeStore();

  return (
    <div className="flex items-center justify-center h-screen" data-theme={theme}>
        <LoaderIcon className="animate-spin size-12 text-primary" />
        <span className="ml-4 text-lg text-gray-700">Loading...</span>
    </div>
  )
}

export default PageLoader;