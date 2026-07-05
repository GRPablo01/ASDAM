import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkMode.asObservable();
  themeChange$ = this.darkMode.asObservable();

  // =======================================
  // 🎨 PALETTE COMPLÈTE - 20 COULEURS AS DAM FOOTBALL
  // =======================================

  // 🔴 Couleur 1 - Rouge AS DAM principal (#E11D48)
  c1Base = '#E11D48';
  c1Light = '#FF6B8A';
  c1Dark = '#9B1232';

  // 🔵 Couleur 2 - Bleu AS DAM principal (#2563EB)
  c2Base = '#2563EB';
  c2Light = '#60A5FA';
  c2Dark = '#1E3A8A';

  // 🔴 Couleur 3 - Rouge accent (#DC2626)
  c3Base = '#DC2626';
  c3Light = '#FCA5A5';
  c3Dark = '#7F1D1D';

  // 🔵 Couleur 4 - Bleu accent (#1D4ED8)
  c4Base = '#1D4ED8';
  c4Light = '#93C5FD';
  c4Dark = '#1E3A8A';

  // ⚪ Couleur 5 - Blanc pur (#FFFFFF)
  c5Base = '#FFFFFF';
  c5Light = '#FFFFFF';
  c5Dark = '#E5E7EB';

  // ⚫ Couleur 6 - Noir profond (#111827)
  c6Base = '#111827';
  c6Light = '#374151';
  c6Dark = '#030712';

  // 🔴 Couleur 7 - Rouge corail (#F97316)
  c7Base = '#F97316';
  c7Light = '#FDBA74';
  c7Dark = '#9A3412';

  // 🔵 Couleur 8 - Bleu ciel (#3B82F6)
  c8Base = '#3B82F6';
  c8Light = '#BFDBFE';
  c8Dark = '#1E40AF';

  // 🟢 Couleur 9 - Vert terrain (#16A34A)
  c9Base = '#16A34A';
  c9Light = '#86EFAC';
  c9Dark = '#14532D';

  // 🟡 Couleur 10 - Jaune maillot (#FACC15)
  c10Base = '#FACC15';
  c10Light = '#FEF08A';
  c10Dark = '#A16207';

  // 🟣 Couleur 11 - Violet équipe (#7C3AED)
  c11Base = '#7C3AED';
  c11Light = '#C4B5FD';
  c11Dark = '#4C1D95';

  // 🩷 Couleur 12 - Rose (#EC4899)
  c12Base = '#EC4899';
  c12Light = '#FBCFE8';
  c12Dark = '#9D174D';

  // ⚪ Couleur 13 - Gris clair (#F3F4F6)
  c13Base = '#F3F4F6';
  c13Light = '#FFFFFF';
  c13Dark = '#9CA3AF';

  // ⚫ Couleur 14 - Gris foncé (#4B5563)
  c14Base = '#4B5563';
  c14Light = '#9CA3AF';
  c14Dark = '#1F2937';

  // 🔴 Couleur 15 - Rouge sang (#B91C1C)
  c15Base = '#B91C1C';
  c15Light = '#F87171';
  c15Dark = '#450A0A';

  // 🔵 Couleur 16 - Bleu nuit (#0F172A)
  c16Base = '#0F172A';
  c16Light = '#334155';
  c16Dark = '#020617';

  // 🟠 Couleur 17 - Orange stade (#EA580C)
  c17Base = '#EA580C';
  c17Light = '#FDBA74';
  c17Dark = '#7C2D12';

  // 🟢 Couleur 18 - Vert gazon (#22C55E)
  c18Base = '#22C55E';
  c18Light = '#BBF7D0';
  c18Dark = '#166534';

  // ⚪ Couleur 19 - Argent trophée (#D1D5DB)
  c19Base = '#D1D5DB';
  c19Light = '#F9FAFB';
  c19Dark = '#6B7280';

  // 🟡 Couleur 20 - Or (#F59E0B)
  c20Base = '#F59E0B';
  c20Light = '#FDE68A';
  c20Dark = '#78350F';


  Backgroundprincipaltest = '';
  Backgroundsecondairetest = '';
  Bowshadowtest = '';

  NavBackground=''
  NavTexteprincipal=''
  NavTextesecondaire=''
  NavHover=''
  NavActive=''
  NavBorder=''

  IconBackground=''
  IconHover=''
  Icon=''
  IconBorder=''







  // ===============================
  // 🎨 HEADER COLORS (3 couleurs)
  // ===============================
  Backgroundheader = '';
  Backgroundheader1 = '';
  Backgroundheader2 = '';

  // ===============================
  // 🎨 BACKGROUND COLORS (4 couleurs)
  // ===============================
  Backgroundprincipal = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';

  // ===============================
  // ✍️ TEXT COLORS
  // ===============================
  Textprincipal = '';
  Textsecondaire = '';

  // ===============================
  // 📊 DASHBOARD
  // ===============================
  dashboardPrimary = '';
  dashboardPrimaryHover = '';
  dashboardPrimarySoft = '';

  // =======================================
  // 👥 EQUIPE / MEMORY
  // =======================================
  teamPrimary = '';
  teamPrimaryHover = '';
  teamPrimarySoft = '';

  // =======================================
  // 📋 CONVOCATION / QCM
  // =======================================
  convocationPrimary = '';
  convocationPrimaryHover = '';
  convocationPrimarySoft = '';

  // =======================================
  // 🎉 EVENT / MATCH
  // =======================================
  eventPrimary = '';
  eventPrimaryHover = '';
  eventPrimarySoft = '';

  // ===============================
  // ⚽ FOOTBALL BRAND COLORS
  // ===============================
  primary = '';
  primarySoft = '';
  primaryGlow = '';

  secondary = '';
  secondarySoft = '';

  Iconnormal = '';
  Iconhover = '';
  Iconactive = '';

  Fondboutonprincipal = '';
  Fondboutonsecondaire = '';

  accent = '';
  accentGlow = '';

  BgOui = '';
  BgNon = '';
  BorderOui = '';
  BorderNon = '';
  BgBleu = '';
  BorderBleu = '';
  BgBleuText = '';
  BgNonText = '';
  BgOuiText = '';
  Bordernormal = '';

  // ===============================
  // 🌫️ GLASS / EFFECTS
  // ===============================
  GlassBackground = '';
  GlassBorder = '';
  GlassShadow = '';

  CardHover = '';

  // ===============================
  // IMAGES THEME
  // ===============================
  ThemeImage: string = '';
  BackgroundImage: string = '';

  constructor() {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const newMode = !this.darkMode.value;
    this.darkMode.next(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.applyTheme(newMode);
  }

  applyTheme(isDark: boolean) {
    const html = document.documentElement;

    if (isDark) html.classList.add('dark');
    else html.classList.remove('dark');

    this.setThemeColors(isDark);
  }

  setThemeColors(isDark: boolean): void {

    // =================================================
    // 🌙 DARK MODE (STADIUM NIGHT ⚽🔴🔵)
    // =================================================
    if (isDark) {

      this.Backgroundprincipaltest ='#0B1220'
      this.Backgroundsecondairetest ='#1E293B'

      this.Bowshadowtest ='0 4px 20px rgba(0, 0, 0, 0.35)'
      this.Bordernormal='#334155'

      this.Textprincipal='#CBD5E1'
      this.Textsecondaire='#F8FAFC'

      this.NavBackground='#0F172A'
      this.NavTexteprincipal='#111827'
      this.NavTextesecondaire='#F8FAFC'
      this.NavHover='#0F172A'
      this.NavActive='#EF4444'
      this.NavBorder='#334155'

      this.IconBackground='#1E293B'
      this.IconHover='#334155'
      this.Icon='#F8FAFC'
      this.IconBorder='#475569'

      this.primary = '#E11D48';
      this.primarySoft = '#FF6B8A';
      this.primaryGlow = '#9B1232';

      this.secondary = this.c2Base;
      this.secondarySoft = this.c4Dark;


      // =======================================
      // DASHBOARD
      // =======================================
      this.dashboardPrimary = this.c7Base;
      this.dashboardPrimaryHover = this.c17Base;
      this.dashboardPrimarySoft = this.c7Dark;

      // =======================================
      // TEAM / 
      // =======================================
      this.teamPrimary = this.c11Base;
      this.teamPrimaryHover = this.c11Dark;
      this.teamPrimarySoft = this.c11Dark;

      // =======================================
      // CONVOCATION 
      // =======================================
      this.convocationPrimary = this.c9Base;
      this.convocationPrimaryHover = this.c18Base;
      this.convocationPrimarySoft = this.c9Dark;

      // =======================================
      // EVENT / MATCH
      // =======================================
      this.eventPrimary = this.c12Base;
      this.eventPrimaryHover = this.c12Light;
      this.eventPrimarySoft = this.c12Dark;

      // =======================================
      // STATUS COLORS
      // =======================================
      this.BgOui = this.c9Dark;
      this.BorderOui = this.c18Base;
      this.BgOuiText = this.c5Base;

      this.BgNon = this.c3Dark;
      this.BgNonText = this.c5Base;
      this.BorderNon = this.c1Base;




      




      // =======================================
      // HEADER
      // =======================================
      // this.Backgroundheader  = this.c16Dark;
      // this.Backgroundheader1 = this.c16Base;
      // this.Backgroundheader2 = this.c14Base;

      // =======================================
      // BACKGROUND
      // =======================================
      // this.Backgroundprincipal = this.c6Dark;
      // this.Background1 = this.c16Base;
      // this.Background2 = this.c14Dark;
      // this.Background3 = this.c14Base;

      // =======================================
      // TEXT
      // =======================================
      // this.Textprincipal = this.c5Base;
      // this.Textsecondaire = this.c13Dark;

      // // =======================================
      // // ICONS
      // // =======================================
      // this.Iconnormal = this.c13Dark;
      // this.Iconhover = this.c1Base;
      // this.Iconactive = this.c3Base;

      // // =======================================
      // // FOOTBALL COLORS - AS DAM
      // // =======================================
      // this.primary = this.c1Base;
      // this.primarySoft = this.c3Dark;
      // this.primaryGlow = '0 0 25px ' + this.c1Base + '99';

      // this.secondary = this.c2Base;
      // this.secondarySoft = this.c4Dark;

      // this.accent = this.c8Base;
      // this.accentGlow = '0 0 25px ' + this.c2Base + '80';

      

      // this.Bordernormal = this.c5Base + '1F';

      // // =======================================
      // // GLASS EFFECT
      // // =======================================
      // this.GlassBackground = this.c5Base + '0D';
      // this.GlassBorder = this.c5Base + '14';
      // this.GlassShadow = '0 10px 40px ' + this.c6Dark + 'A6';

      // this.CardHover = this.c5Base + '14';

      // =======================================
      // IMAGES
      // =======================================
      this.ThemeImage = 'assets/LOGO.png';
      this.BackgroundImage = 'assets/stadium-night.jpg';
    }

    // =================================================
    // ☀️ LIGHT MODE (DAY MATCH ⚽🔴🔵)
    // =================================================
    else {

      this.Backgroundprincipaltest ='#F8FAFC'
      this.Backgroundsecondairetest ='#EEF2F7'

      this.Bowshadowtest ='0 4px 20px rgba(15, 23, 42, 0.08)'
      this.Bordernormal='#CBD5E1'

      this.Textprincipal='#0F172A'
      this.Textsecondaire='#475569'

      this.NavBackground='#FFFFFF'
      this.NavTexteprincipal='#F8FAFC'
      this.NavTextesecondaire='#475569'
      this.NavHover='#E2E8F0'
      this.NavActive='#EF4444'
      this.NavBorder='#E2E8F0'

      this.IconBackground='#F1F5F9'
      this.IconHover='#E2E8F0'
      this.Icon='#0F172A'
      this.IconBorder='#CBD5E1'

      this.primary = '#E11D48';
      this.primarySoft = '#FF6B8A';
      this.primaryGlow = '#9B1232';

      this.secondary = this.c4Base;
      this.secondarySoft = this.c4Light + '33';


      // =======================================
      // DASHBOARD
      // =======================================
      this.dashboardPrimary = this.c7Base;
      this.dashboardPrimaryHover = this.c17Base;
      this.dashboardPrimarySoft = this.c7Light + '33';

      // =======================================
      // TEAM / MEMORY
      // =======================================
      this.teamPrimary = this.c11Base;
      this.teamPrimaryHover = this.c11Dark;
      this.teamPrimarySoft = this.c11Light + '33';

      // =======================================
      // CONVOCATION / QCM
      // =======================================
      this.convocationPrimary = this.c9Base;
      this.convocationPrimaryHover = this.c18Base;
      this.convocationPrimarySoft = this.c9Light + '33';

      // =======================================
      // EVENT / MATCH
      // =======================================
      this.eventPrimary = this.c12Base;
      this.eventPrimaryHover = this.c12Dark;
      this.eventPrimarySoft = this.c12Light + '33';

      // =======================================
      // STATUS COLORS
      // =======================================
      this.BgOui = this.c9Dark;
      this.BorderOui = this.c18Base;
      this.BgOuiText = this.c5Base;

      this.BgNon = this.c3Dark;
      this.BgNonText = this.c5Base;
      this.BorderNon = this.c1Base;









      // // =======================================
      // // HEADER
      // // =======================================
      // this.Backgroundheader  = this.c5Base;
      // this.Backgroundheader1 = this.c13Base;
      // this.Backgroundheader2 = this.c13Dark;

      // // =======================================
      // // BACKGROUND
      // // =======================================
      // this.Backgroundprincipal = this.c5Base;
      // this.Background1 = this.c13Base;
      // this.Background2 = this.c13Dark + '33';
      // this.Background3 = this.c19Base;

      // // =======================================
      // // TEXT
      // // =======================================
      // this.Textprincipal = this.c6Base;
      // this.Textsecondaire = this.c14Base;

      // // =======================================
      // // ICONS
      // // =======================================
      // this.Iconnormal = this.c14Base;
      // this.Iconhover = this.c3Base;
      // this.Iconactive = this.c15Base;

      // // =======================================
      // // FOOTBALL COLORS - AS DAM
      // // =======================================
      // this.primary = this.c3Base;
      // this.primarySoft = this.c3Light + '33';
      // this.primaryGlow = '0 0 15px ' + this.c3Base + '4D';

      // this.secondary = this.c4Base;
      // this.secondarySoft = this.c4Light + '33';

      // this.accent = this.c8Base;
      // this.accentGlow = '0 0 15px ' + this.c8Base + '4D';

      

      // this.Bordernormal = this.c6Base + '14';

      // // =======================================
      // // GLASS EFFECT
      // // =======================================
      // this.GlassBackground = this.c5Base + 'BF';
      // this.GlassBorder = this.c5Base + 'E6';
      // this.GlassShadow = '0 8px 30px ' + this.c16Base + '14';

      // this.CardHover = this.c13Base;

      // =======================================
      // IMAGES
      // =======================================
      this.ThemeImage = 'assets/LOGO.png';
      this.BackgroundImage = 'assets/stadium-day.jpg';
    }
  }

  get isDarkMode() {
    return this.darkMode.value;
  }

  // =======================================
  // 🔥 COMPATIBILITY METHODS (IMPORTANT)
  // =======================================

  setLightMode(): void {
    this.darkMode.next(false);
    localStorage.setItem('theme', 'light');
    this.applyTheme(false);
  }

  setDarkMode(): void {
    this.darkMode.next(true);
    localStorage.setItem('theme', 'dark');
    this.applyTheme(true);
  }

  resetTheme(): void {
    localStorage.removeItem('theme');
  
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
  
    this.darkMode.next(systemPrefersDark);
    this.applyTheme(systemPrefersDark);
  }

  // =======================================
  // 🎨 HELPER - Get color by theme
  // =======================================

  getColor(colorName: string, isDark?: boolean): string {
    const dark = isDark !== undefined ? isDark : this.isDarkMode;
    const colorMap: { [key: string]: { light: string; dark: string } } = {
      c1: { light: this.c1Light, dark: this.c1Dark },
      c2: { light: this.c2Light, dark: this.c2Dark },
      c3: { light: this.c3Light, dark: this.c3Dark },
      c4: { light: this.c4Light, dark: this.c4Dark },
      c5: { light: this.c5Light, dark: this.c5Dark },
      c6: { light: this.c6Light, dark: this.c6Dark },
      c7: { light: this.c7Light, dark: this.c7Dark },
      c8: { light: this.c8Light, dark: this.c8Dark },
      c9: { light: this.c9Light, dark: this.c9Dark },
      c10: { light: this.c10Light, dark: this.c10Dark },
      c11: { light: this.c11Light, dark: this.c11Dark },
      c12: { light: this.c12Light, dark: this.c12Dark },
      c13: { light: this.c13Light, dark: this.c13Dark },
      c14: { light: this.c14Light, dark: this.c14Dark },
      c15: { light: this.c15Light, dark: this.c15Dark },
      c16: { light: this.c16Light, dark: this.c16Dark },
      c17: { light: this.c17Light, dark: this.c17Dark },
      c18: { light: this.c18Light, dark: this.c18Dark },
      c19: { light: this.c19Light, dark: this.c19Dark },
      c20: { light: this.c20Light, dark: this.c20Dark },
    };
    return colorMap[colorName]?.[dark ? 'dark' : 'light'] || colorMap[colorName]?.light || '#000000';
  }
}