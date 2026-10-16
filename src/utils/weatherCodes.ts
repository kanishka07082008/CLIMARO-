import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  Snowflake,
  type LucideIcon
} from 'lucide-react';

export interface WeatherConditionInfo {
  code: number;
  label: string;
  icon: LucideIcon;
  bgType: 'clear' | 'cloudy' | 'rain' | 'thunder' | 'snow';
  iconColor: string;
  gradientText: string;
}

export function getWeatherInfo(code: number, isDay: boolean = true): WeatherConditionInfo {
  // 0: Clear sky
  if (code === 0) {
    return {
      code,
      label: isDay ? 'Clear Sky' : 'Clear Night',
      icon: isDay ? Sun : Moon,
      bgType: 'clear',
      iconColor: isDay ? 'text-amber-500' : 'text-indigo-300',
      gradientText: isDay ? 'from-amber-400 to-orange-500' : 'from-indigo-300 to-sky-400',
    };
  }

  // 1: Mainly clear
  if (code === 1) {
    return {
      code,
      label: isDay ? 'Mainly Clear' : 'Mainly Clear Night',
      icon: isDay ? CloudSun : CloudMoon,
      bgType: 'clear',
      iconColor: isDay ? 'text-amber-400' : 'text-indigo-300',
      gradientText: isDay ? 'from-amber-400 to-sky-400' : 'from-indigo-300 to-slate-300',
    };
  }

  // 2: Partly cloudy
  if (code === 2) {
    return {
      code,
      label: 'Partly Cloudy',
      icon: isDay ? CloudSun : CloudMoon,
      bgType: 'cloudy',
      iconColor: isDay ? 'text-sky-400' : 'text-slate-300',
      gradientText: 'from-sky-400 to-blue-500',
    };
  }

  // 3: Overcast
  if (code === 3) {
    return {
      code,
      label: 'Overcast',
      icon: Cloud,
      bgType: 'cloudy',
      iconColor: 'text-slate-400 dark:text-slate-300',
      gradientText: 'from-slate-400 to-slate-600 dark:from-slate-300 dark:to-slate-400',
    };
  }

  // 45, 48: Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return {
      code,
      label: code === 48 ? 'Rime Fog' : 'Foggy',
      icon: CloudFog,
      bgType: 'cloudy',
      iconColor: 'text-teal-400',
      gradientText: 'from-teal-400 to-slate-500',
    };
  }

  // 51, 53, 55: Drizzle
  if (code === 51 || code === 53 || code === 55) {
    return {
      code,
      label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
      icon: CloudDrizzle,
      bgType: 'rain',
      iconColor: 'text-cyan-400',
      gradientText: 'from-cyan-400 to-blue-500',
    };
  }

  // 56, 57: Freezing Drizzle
  if (code === 56 || code === 57) {
    return {
      code,
      label: 'Freezing Drizzle',
      icon: CloudSnow,
      bgType: 'snow',
      iconColor: 'text-cyan-300',
      gradientText: 'from-cyan-300 to-indigo-400',
    };
  }

  // 61, 63, 65: Rain
  if (code === 61 || code === 63 || code === 65) {
    return {
      code,
      label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
      icon: CloudRain,
      bgType: 'rain',
      iconColor: 'text-blue-400',
      gradientText: 'from-blue-400 to-indigo-600',
    };
  }

  // 66, 67: Freezing Rain
  if (code === 66 || code === 67) {
    return {
      code,
      label: 'Freezing Rain',
      icon: CloudSnow,
      bgType: 'snow',
      iconColor: 'text-sky-300',
      gradientText: 'from-sky-300 to-blue-600',
    };
  }

  // 71, 73, 75: Snow fall
  if (code === 71 || code === 73 || code === 75) {
    return {
      code,
      label: code === 71 ? 'Slight Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snow',
      icon: Snowflake,
      bgType: 'snow',
      iconColor: 'text-sky-200',
      gradientText: 'from-sky-200 to-blue-300',
    };
  }

  // 77: Snow grains
  if (code === 77) {
    return {
      code,
      label: 'Snow Grains',
      icon: Snowflake,
      bgType: 'snow',
      iconColor: 'text-sky-200',
      gradientText: 'from-sky-200 to-blue-300',
    };
  }

  // 80, 81, 82: Rain showers
  if (code === 80 || code === 81 || code === 82) {
    return {
      code,
      label: code === 80 ? 'Light Showers' : code === 81 ? 'Showers' : 'Violent Rain Showers',
      icon: CloudRain,
      bgType: 'rain',
      iconColor: 'text-blue-500',
      gradientText: 'from-blue-400 to-indigo-500',
    };
  }

  // 85, 86: Snow showers
  if (code === 85 || code === 86) {
    return {
      code,
      label: 'Snow Showers',
      icon: CloudSnow,
      bgType: 'snow',
      iconColor: 'text-sky-300',
      gradientText: 'from-sky-300 to-indigo-400',
    };
  }

  // 95, 96, 99: Thunderstorm
  if (code === 95 || code === 96 || code === 99) {
    return {
      code,
      label: code === 95 ? 'Thunderstorm' : 'Severe Thunderstorm & Hail',
      icon: CloudLightning,
      bgType: 'thunder',
      iconColor: 'text-amber-400',
      gradientText: 'from-amber-400 to-purple-500',
    };
  }

  // Fallback default
  return {
    code,
    label: 'Partly Cloudy',
    icon: Cloud,
    bgType: 'cloudy',
    iconColor: 'text-sky-400',
    gradientText: 'from-sky-400 to-blue-500',
  };
}
