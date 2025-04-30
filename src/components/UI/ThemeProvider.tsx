"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { ConfigProvider, theme as antTheme } from "antd"

type ThemeMode = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = "system" }) => {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  // Initialize theme from localStorage or default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  // Determine if dark mode should be active
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const updateIsDarkMode = () => {
      if (theme === "system") {
        setIsDarkMode(mediaQuery.matches)
      } else {
        setIsDarkMode(theme === "dark")
      }
    }

    updateIsDarkMode()
    mediaQuery.addEventListener("change", updateIsDarkMode)

    return () => mediaQuery.removeEventListener("change", updateIsDarkMode)
  }, [theme])

  // Custom theme configuration
  const themeConfig = {
    token: {
      colorPrimary: "#1890ff",
      borderRadius: 6,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    components: {
      Button: {
        borderRadius: 6,
        controlHeight: 36,
      },
      Card: {
        borderRadius: 12,
      },
      Input: {
        borderRadius: 6,
      },
      Select: {
        borderRadius: 6,
      },
      Table: {
        borderRadius: 8,
      },
      Modal: {
        borderRadius: 12,
      },
    },
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      <ConfigProvider
        theme={{
          ...themeConfig,
          algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
