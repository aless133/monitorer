<?php
namespace a133\env;

class Env
{
    private static $loaded = false;
    private static $cache = [];

    /**
     * Get environment variable value
     */
    public static function get(string $key, $default = null)
    {
        // Load environment variables on first access
        if (!self::$loaded) {
            self::load();
        }

        return self::$cache[$key] ?? $default;
    }

    /**
     * Load environment variables from .env file
     */
    private static function load(): void
    {
        $envFile = __DIR__ . '/.env';
        
        if (!file_exists($envFile)) {
            self::$loaded = true;
            return;
        }

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments and invalid lines
            if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) {
                continue;
            }
            
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            
            // Remove quotes if present
            $value = self::parseValue($value);
            
            // Cache the value
            self::$cache[$name] = $value;
            
            // Also set in actual environment if not already set
            // if (!array_key_exists($name, $_ENV) && getenv($name) === false) {
            //     $_ENV[$name] = $value;
            //     putenv("$name=$value");
            // }
        }

        self::$loaded = true;
    }

    /**
     * Parse value and remove surrounding quotes
     */
    private static function parseValue(string $value): string
    {
        // Remove single or double quotes from both ends
        $length = strlen($value);
        if ($length > 1) {
            $firstChar = $value[0];
            $lastChar = $value[$length - 1];
            
            if (($firstChar === '"' && $lastChar === '"') ||
                ($firstChar === "'" && $lastChar === "'")) {
                return substr($value, 1, -1);
            }
        }
        
        return $value;
    }

    /**
     * Check if environment variable exists
     */
    // public static function has(string $key): bool
    // {
    //     if (!self::$loaded) {
    //         self::load();
    //     }

    //     return array_key_exists($key, self::$cache);
    // }

    /**
     * Get all loaded environment variables
     */
    // public static function all(): array
    // {
    //     if (!self::$loaded) {
    //         self::load();
    //     }

    //     return self::$cache;
    // }

    /**
     * Clear cached environment variables (for testing)
     */
    // public static function clear(): void
    // {
    //     self::$loaded = false;
    //     self::$cache = [];
    // }
}