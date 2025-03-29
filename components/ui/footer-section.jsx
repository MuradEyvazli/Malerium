"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Moon,
  Sun,
  Mail,
  ArrowUpRight,
  Check,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [currentYear] = useState(new Date().getFullYear());

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Simple notification system
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Handle contact form
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  // Email sending function
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      showNotification("Lütfen tüm gerekli alanları doldurun", "error");
      return;
    }
    
    setIsSending(true);
    
    try {
      // API çağrısı
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactFormData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Mesaj gönderilirken bir hata oluştu");
      }
      
      setSendSuccess(true);
      showNotification("Mesajınız başarıyla gönderildi!");
      
      // 1.5 saniye sonra formu sıfırla
      setTimeout(() => {
        setContactFormData({
          name: "",
          email: "",
          message: "",
        });
        setSendSuccess(false);
        setShowContactForm(false);
      }, 1500);
    } catch (error) {
      showNotification(error.message || "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.", "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Bildirim kutusu */}
      {notification.show && (
        <div 
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all ${
            notification.type === "error" 
              ? "bg-red-500 text-white" 
              : "bg-green-500 text-white"
          }`}
        >
          {notification.type === "error" ? (
            <X className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Arka plan efektleri */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl dark:bg-primary/5 opacity-50" />
      
      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8 relative z-10">
        {/* Ana footer içeriği */}
        <div className="grid gap-12 md:grid-cols-12">
          {/* Logo ve marka bölümü */}
          <div className="space-y-6 md:col-span-5 lg:col-span-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-bold text-2xl text-primary-foreground">M</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Malerium</h2>
            </div>
            
            <p className="text-muted-foreground max-w-md">
              Dünyanın en iyi tasarımlarını sizler için bir araya getiriyoruz. İlham, yaratıcılık ve estetik mükemmellik için varış noktanız.
            </p>
            
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Karanlık modu değiştir
              </Label>
            </div>
          </div>
          
          {/* Orta bölümler ve linkler */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Navigasyon Linkleri */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
                  Navigasyon
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Ana Sayfa</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Keşfet</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Koleksiyonlar</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Hakkımızda</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Blog</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Kaynaklar Linkleri */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
                  Kaynaklar
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Tasarım Araçları</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Rehberler</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Ücretsiz Kaynaklar</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Renk Paletleri</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="inline-flex items-center group">
                      <span className="transition-colors group-hover:text-primary">Tipografi</span>
                      <ChevronRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* İletişim ve Sosyal Medya */}
              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">
                  Bağlantı
                </h3>
                
                <address className="not-italic text-sm text-muted-foreground mb-4">
                  <p>Azerbaycan, Bakü</p>
                  <p>Telefon: (536) 996-5484</p>
                  <p className="truncate">E-posta: muradeyvazli18@gmail.com</p>
                </address>
                
                {/* İletişim formu butonu */}
                <Button 
                  className="mb-6 w-full flex items-center gap-2 group"
                  onClick={() => setShowContactForm(!showContactForm)}
                >
                  <Mail className="h-4 w-4" />
                  <span>Bize Ulaşın</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-auto" />
                </Button>
                
                {/* İletişim formu */}
                {showContactForm && (
                  <div className="mb-6 p-4 bg-background border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Bize mesaj gönderin</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowContactForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {sendSuccess ? (
                      <div className="py-6 text-center">
                        <div className="mx-auto mb-2 h-8 w-8 flex items-center justify-center rounded-full bg-green-100">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm">Mesajınız başarıyla gönderildi!</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-xs mb-1 block">İsim <span className="text-red-500">*</span></Label>
                          <Input 
                            id="name" 
                            name="name" 
                            placeholder="Adınız"
                            size="sm"
                            className="text-sm"
                            value={contactFormData.name}
                            onChange={handleContactChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs mb-1 block">
                            E-posta <span className="text-red-500">*</span>
                          </Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="ornek@email.com" 
                            required
                            size="sm"
                            className="text-sm"
                            value={contactFormData.email}
                            onChange={handleContactChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="message" className="text-xs mb-1 block">
                            Mesaj <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="message"
                            name="message"
                            placeholder="Mesajınız"
                            required
                            className="min-h-[80px] text-sm"
                            value={contactFormData.message}
                            onChange={handleContactChange}
                          />
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowContactForm(false)}
                            className="text-xs"
                          >
                            İptal
                          </Button>
                          <Button 
                            type="submit" 
                            size="sm" 
                            disabled={isSending}
                            className="gap-1 text-xs"
                          >
                            {isSending && <Loader2 className="h-3 w-3 animate-spin" />}
                            {isSending ? 'Gönderiliyor...' : 'Gönder'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
                
                {/* Sosyal Medya Linkleri */}
                <div className="flex space-x-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-background hover:bg-muted transition-colors">
                          <Facebook className="h-4 w-4" />
                          <span className="sr-only">Facebook</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Facebook'ta takip edin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-background hover:bg-muted transition-colors">
                          <Twitter className="h-4 w-4" />
                          <span className="sr-only">Twitter</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Twitter'da takip edin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-background hover:bg-muted transition-colors">
                          <Instagram className="h-4 w-4" />
                          <span className="sr-only">Instagram</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Instagram'da takip edin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-background hover:bg-muted transition-colors">
                          <Linkedin className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>LinkedIn'de bağlantı kurun</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alt copyright ve yasal linkler */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="order-2 md:order-1">
            © {currentYear} Malerium. Tüm hakları saklıdır.
          </div>
          
          <div className="order-1 md:order-2 flex flex-wrap gap-6 justify-center">
            <a href="#" className="transition-colors hover:text-primary">Gizlilik Politikası</a>
            <a href="#" className="transition-colors hover:text-primary">Kullanım Şartları</a>
            <a href="#" className="transition-colors hover:text-primary">Çerez Ayarları</a>
            <a href="#" className="transition-colors hover:text-primary">Erişilebilirlik</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footerdemo }