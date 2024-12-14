'use client'

import { useTheme } from '../contexts/ThemeContext'
import { Button } from './ui/button'
import { Moon, Sun, Sunset, Coffee } from 'lucide-react'

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: 'latte', icon: Coffee },
    { name: 'frappe', icon: Sunset },
    { name: 'macchiato', icon: Moon },
    { name: 'mocha', icon: Sun },
  ] as const

  return (
    <div className="flex space-x-2">
      {themes.map(({ name, icon: Icon }) => (
        <Button
          key={name}
          variant={theme === name ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTheme(name)}
          title={`Switch to ${name} theme`}
        >
          <Icon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch to {name} theme</span>
        </Button>
      ))}
    </div>
  )
}

export default ThemeSwitcher

