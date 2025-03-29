'use client'
import React from 'react';

const NextjsBlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout - Using Grid instead of flex for better control */}
      <div className="grid grid-cols-12">
        {/* Main Content Column with correct left margin  */}
        <div className="col-span-12">
          {/* Hero Section */}
          <header className="relative h-80 pt-16 bg-gradient-to-b from-black to-gray-800">
            {/* Geri Dönme Tuşu */}
            <div className="absolute top-4 left-4 z-20">
              <a href="/blog" className="flex items-center text-white hover:bg-gray-900 transition-colors py-2 px-4 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Geri Dön
              </a>
            </div>
            <div className="absolute inset-0 z-0">
              
            </div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
              <h1 className="text-4xl font-bold mb-4 text-white">Next.js: Üretim için React Framework'ü</h1>
              <p className="text-gray-300 max-w-3xl">
                Next.js, React uygulamalarını geliştirmek için tasarlanmış, performans, SEO ve geliştirici deneyimini optimize eden tam donanımlı bir framework'tür. Sunucu taraflı rendering, statik site oluşturma ve modern web geliştirme prensiplerini bir araya getirir.
              </p>
            </div>
          </header>

          {/* Main Article Section */}
          <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-2/3">
                {/* Author Info */}
                <div className="flex items-center text-sm text-gray-500 mb-8">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2">
                      <span>ME</span>
                    </div>
                    <span className="font-medium">Murad Eyvazli</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>5 Mart 2025</span>
                  <span className="mx-2">•</span>
                  <span>13 dk okuma</span>
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <p>
                    Next.js, Vercel (eski adıyla ZEIT) tarafından geliştirilen, React tabanlı bir web framework'üdür. 2016 yılında piyasaya sürüldüğünden beri, Next.js, React uygulamaları için varsayılan bir üretim çözümü haline geldi. React'ın sunduğu güçlü komponent tabanlı UI geliştirme yaklaşımını korurken, sunucu taraflı rendering (SSR), statik site oluşturma (SSG) ve artan oranda popülerlik kazanan artımlı statik yeniden oluşturma (ISR) gibi ek özellikler sunar.
                  </p>
                
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                    <blockquote className="italic text-blue-800 m-0">
                      "Next.js, React'ın eksik olduğu alanları tamamlıyor: routing, sunucu taraflı rendering ve build-time optimizasyonları. Bu, onu React projelerinizi üretim seviyesine taşımak için ideal bir araç haline getiriyor."
                    </blockquote>
                  </div>
                
                  <p>
                    Next.js'in başarısının ardındaki temel faktörlerden biri, geliştirici deneyimine (DX) olan odaklanmasıdır. Sıfır konfigürasyon, otomatik code splitting, hot module replacement ve file-system based routing gibi özelliklerle, Next.js geliştiricilere hızlı ve verimli bir şekilde uygulamalar oluşturma imkanı sağlar.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Next.js'in Temel Özellikleri</h2>
                  <p>
                    Next.js, modern web geliştirmenin karmaşıklıklarını çözmek için çeşitli özellikler sunar. İşte en önemli özelliklerinden bazıları:
                  </p>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Hibrit Rendering</h3>
                          <p className="mt-1 text-gray-600">SSG, SSR ve CSR (Client-Side Rendering) arasında sayfa bazında veya hatta bileşen bazında seçim yapma esnekliği</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Otomatik Code Splitting</h3>
                          <p className="mt-1 text-gray-600">Her sayfa için yalnızca gerekli JavaScript'i yükleyerek daha hızlı sayfa yükleme süreleri sağlar</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">File-System Based Routing</h3>
                          <p className="mt-1 text-gray-600">Dosya yapısına dayalı basit ve sezgisel yönlendirme sistemi, karmaşık konfigürasyonlara gerek kalmadan</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">API Routes</h3>
                          <p className="mt-1 text-gray-600">Serverless fonksiyonlar olarak API endpoint'lerini kolayca oluşturmanıza olanak tanır</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Next.js 13 ile Gelen Yenilikler</h2>
                  <p>
                    Next.js 13, framework için büyük bir gelişme olarak ortaya çıktı ve App Router, Server Components ve daha fazlası gibi yeni özellikler getirdi. Bu güncellemeler, Next.js uygulamalarının nasıl yapılandırıldığı ve geliştirildiği konusunda önemli değişiklikler sunuyor.
                  </p>
                  
                  <div className="relative my-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Next.js 13+ Öne Çıkan Özellikler</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">App Router</h4>
                            <p className="text-sm text-gray-600">Pages Router'ın yerini alan, Server Components, Layouts ve daha fazlasını destekleyen yeni dosya tabanlı yönlendirme sistemi</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">React Server Components</h4>
                            <p className="text-sm text-gray-600">Sunucuda render edilen ve JavaScript göndermeyen yeni tür React bileşenleri, daha hızlı yükleme süreleri sağlar</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Streaming</h4>
                            <p className="text-sm text-gray-600">UI'nin parçalar halinde ve kademeli olarak sunucudan istemciye akışını sağlayan destek</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7 11V7a5 5 0 0110 0v4h2v11H5V11h2zm4-7a3 3 0 00-3 3v4h6V7a3 3 0 00-3-3z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Turbopack</h4>
                            <p className="text-sm text-gray-600">Webpack'in yerini alan ve çok daha hızlı derleme süreleri sunan yeni Rust tabanlı bundler (beta)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-4">Vercel İle Entegrasyon</h2>
                  <p>
                    Next.js, Vercel platformu ile sorunsuz entegrasyon sunar ve bu da onun popülaritesine katkıda bulunur. Vercel, Next.js uygulamalarını tek bir komutla veya git pushlarıyla deploy etmenizi sağlar. Platformun edge network'ü ve serverless fonksiyonları, Next.js uygulamalarının ölçeklenebilirliğini ve performansını daha da artırır.
                  </p>
                  
                  <p>
                    Bununla birlikte, Next.js Vercel'e bağımlı değildir. Framework, AWS, Google Cloud, Azure, Docker veya self-hosted bir Node.js sunucusu gibi çeşitli ortamlarda deploy edilebilir.
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Use Cases ve Yaygın Kullanım Alanları</h2>
                  <p>
                    Next.js'in esnekliği, çeşitli web uygulaması türleri için ideal bir seçim haline getirir:
                  </p>
                  
                  <ul className="list-disc pl-6 my-4 space-y-2">
                    <li><strong>E-ticaret Siteleri:</strong> Yüksek performans ve SEO önemli olduğunda</li>
                    <li><strong>Blog ve İçerik Siteleri:</strong> Statik site oluşturma özellikleri sayesinde</li>
                    <li><strong>Kurumsal Web Siteleri:</strong> Hızlı yükleme süreleri ve SEO avantajları nedeniyle</li>
                    <li><strong>Web Uygulamaları:</strong> Dinamik özellikler ve iyi geliştirici deneyimi için</li>
                    <li><strong>Mikroservis Frontend'leri:</strong> API rotaları ve serverless fonksiyonlar sayesinde</li>
                  </ul>

                  <h2 className="text-2xl font-bold mt-10 mb-4">Geleceğe Bakış</h2>
                  <p>
                    Next.js'in geleceği, web geliştirme trendlerindeki daha geniş değişimlerle bağlantılı görünüyor. Server Components, streaming SSR ve edge computing'e doğru olan hareket, Next.js'in geleceğinin bir parçası gibi görünüyor.
                  </p>
                  
                  <p>
                    Sonuç olarak, Next.js React için basit bir wrapper olmaktan çok daha fazlasıdır. Modern web geliştirmede karşılaşılan zorlukları çözmek için tasarlanmış, düşünülmüş bir framework'tür. Sunduğu özellikler ve sürekli iyileştirmelerle, Next.js üretim seviyesi React uygulamaları için go-to framework olarak konumunu güçlendirmeye devam ediyor.
                  </p>
                </article>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                  <h3 className="text-lg font-semibold mb-4">İçindekiler</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-blue-600 font-medium">Next.js: Üretim için React Framework'ü</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Next.js'in Temel Özellikleri</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Next.js 13 ile Gelen Yenilikler</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Vercel İle Entegrasyon</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Use Cases ve Yaygın Kullanım Alanları</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Geleceğe Bakış</a></li>
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">İlgili Makaleler</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/nextjs3.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Server Components ile Frontend Geleceği</h4>
                              <p className="text-xs text-gray-500 mt-1">18 Mart 2025</p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/nextjs-back-button.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">SSR vs. SSG vs. ISR: Doğru Yaklaşımı Seçmek</h4>
                              <p className="text-xs text-gray-500 mt-1">1 Mart 2025</p>
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Related Articles Section */}
          <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8">Benzer Konular</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/next-template.png" 
                      alt="Server Components" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">React Server Components Derinlemesine</h3>
                    <p className="text-gray-600 mb-4">Server Components'in çalışma mantığını, avantajlarını ve dezavantajlarını anlamak için kapsamlı bir rehber.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>20 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>12 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/1*v3XndYeIsBtk4CkpMf7vmA.jpg" 
                      alt="Fullstack Next.js" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Next.js ile Fullstack Uygulamalar</h3>
                    <p className="text-gray-600 mb-4">Next.js, API Routes ve veritabanı entegrasyonları ile tam yığın (fullstack) web uygulamaları oluşturma.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>12 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>10 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/hero.jpg" 
                      alt="Middleware" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Next.js Middleware Kullanım Senaryoları</h3>
                    <p className="text-gray-600 mb-4">Middleware ile kimlik doğrulama, yönlendirme, A/B testleri ve daha fazlasını nasıl uygulayacağınızı öğrenin.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>28 Şubat 2025</span>
                      <span className="mx-2">•</span>
                      <span>8 dk okuma</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {/* Development Mode Indicator */}
      <div className="fixed bottom-0 left-0 bg-gray-800 text-white text-xs py-1 px-3 z-50">
        localhost:3000/blog/nextjs
      </div>
    </div>
  );
};

export default NextjsBlogPage;