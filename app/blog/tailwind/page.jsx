'use client'
import React from 'react';

const TailwindBlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout - Using Grid instead of flex for better control */}
      <div className="grid grid-cols-12">
        {/* Main Content Column with correct left margin  */}
        <div className="col-span-12">
          {/* Hero Section */}
          <header className="relative h-80 pt-16 bg-gradient-to-b from-blue-900 to-blue-700">
            {/* Geri Dönme Tuşu */}
            <div className="absolute top-4 left-4 z-20">
              <a href="/blog" className="flex items-center text-white  hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Geri Dön
              </a>
            </div>
            <div className="absolute inset-0 z-0">
            </div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
              <h1 className="text-4xl font-bold mb-4 text-white">Tailwind CSS: Utility-First Devrimi</h1>
              <p className="text-gray-300 max-w-3xl">
                Tailwind CSS, web geliştirme dünyasında stil yaklaşımına devrim getiren, hızlı ve özelleştirilebilir bir CSS framework'üdür. "Utility-first" felsefesi, geliştiricilere eski CSS yaklaşımlarına göre çok daha esnek bir geliştirme deneyimi sunuyor.
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
                  <span>14 Mart 2025</span>
                  <span className="mx-2">•</span>
                  <span>10 dk okuma</span>
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <p>
                    Tailwind CSS, son yıllarda web geliştirme dünyasında hızla popülerlik kazanan bir CSS framework'üdür. Geleneksel CSS framework'lerinden farklı olarak, "utility-first" bir yaklaşım benimser, yani önceden tasarlanmış bileşenler yerine, doğrudan HTML içinde kullanılabilen utility sınıfları sağlar. Bu yaklaşım, geliştiricilere benzeri görülmemiş bir esneklik ve verimlilik sunar.
                  </p>
                
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                    <blockquote className="italic text-blue-800 m-0">
                      "Tailwind ile HTML'den hiç çıkmadan tasarım yapabiliyorsunuz. Bu, prototipleme sürecini inanılmaz derecede hızlandırıyor ve tasarım tutarlılığını korumayı kolaylaştırıyor."
                    </blockquote>
                  </div>
                
                  <p>
                    Tailwind'in bu yaklaşımı başlangıçta bazı geliştiricilere "kirli HTML" gibi görünse de, pratikte sağladığı geliştirme hızı ve esneklik, bu endişeleri hızla ortadan kaldırıyor.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Utility-First Yaklaşımının Avantajları</h2>
                  <p>
                    Tailwind'in utility-first yaklaşımı, birçok geleneksel CSS sorununu çözer ve geliştirme sürecini önemli ölçüde iyileştirir. İşte bu yaklaşımın sağladığı başlıca avantajlar:
                  </p>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Hızlı Geliştirme</h3>
                          <p className="mt-1 text-gray-600">CSS dosyaları oluşturmak ve aralarında gezinmek yerine, doğrudan HTML içinde çalışabilirsiniz</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Tutarlı Tasarım</h3>
                          <p className="mt-1 text-gray-600">Önceden tanımlanmış değerler, tasarımınızın tüm platformda tutarlı kalmasını sağlar</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Yüksek Özelleştirilebilirlik</h3>
                          <p className="mt-1 text-gray-600">Tailwind, varsayılan temayı projelerinize göre özelleştirmenize olanak tanır</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Optimize Edilmiş Üretim Kodu</h3>
                          <p className="mt-1 text-gray-600">PurgeCSS ile entegrasyon, üretim için son derece küçük CSS dosyaları oluşturur</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Tailwind Ekosistemi</h2>
                  <p>
                    Tailwind, yalnızca bir CSS framework'ü olmanın ötesinde, geniş bir ekosisteme sahiptir. Bu ekosistem, Tailwind'i modern web geliştirme için kapsamlı bir çözüm haline getirir.
                  </p>
                  
                  <div className="relative my-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Tailwind Ekosistemi</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Tailwind CSS</h4>
                            <p className="text-sm text-gray-600">Çekirdek framework, utility sınıflarının tüm setini içerir</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Tailwind UI</h4>
                            <p className="text-sm text-gray-600">Resmi olarak oluşturulmuş profesyonel UI bileşenleri</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm4.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7-7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Headless UI</h4>
                            <p className="text-sm text-gray-600">Tamamen erişilebilir, stil uygulanmamış UI bileşenleri</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Tailwind Forms</h4>
                            <p className="text-sm text-gray-600">Form elemanları için temel stil reset'i sağlar</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-4">Geleceğe Bakış</h2>
                  <p>
                    Tailwind CSS'in hızlı yükselişi, web tasarımı ve geliştirme yaklaşımlarında önemli bir paradigma değişikliğini gösteriyor. Geliştirme hızı, esneklik ve bakım kolaylığı gibi avantajları, onu modern web geliştirme projelerinde tercih edilen bir çözüm haline getiriyor.
                  </p>
                  
                  <p>
                    Sonuçta, Tailwind CSS yalnızca bir araç değil, aynı zamanda web geliştirmeye yönelik yeni bir düşünce biçimidir. Giderek daha fazla geliştirici ve ekip, Tailwind'in sunduğu geliştirme hızı ve esneklik avantajlarını keşfettikçe, bu framework'ün popülaritesi artmaya devam edecektir.
                  </p>
                </article>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                  <h3 className="text-lg font-semibold mb-4">İçindekiler</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-blue-600 font-medium">Tailwind CSS: Utility-First Devrimi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Utility-First Yaklaşımının Avantajları</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Tailwind Ekosistemi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Geleceğe Bakış</a></li>
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">İlgili Makaleler</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/tailwind/aw.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">React ile Tailwind CSS Kullanımı</h4>
                              <p className="text-xs text-gray-500 mt-1">21 Mart 2025</p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/tailwind/bw.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">CSS Framework'leri Karşılaştırması</h4>
                              <p className="text-xs text-gray-500 mt-1">5 Mart 2025</p>
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
                      src="/assets/news/tailwind/cw.jpg" 
                      alt="Responsive Design" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Responsive Tasarım Prensipleri</h3>
                    <p className="text-gray-600 mb-4">Modern web tasarımında responsive yaklaşımlar ve best practice'ler.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>18 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>7 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/tailwind/dw.png" 
                      alt="CSS Architecture" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Modern CSS Mimarisi</h3>
                    <p className="text-gray-600 mb-4">Büyük ölçekli projelerde CSS'i organize etme ve yönetme stratejileri.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>12 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>9 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/tailwind/ew.jpg" 
                      alt="CSS Variables" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">CSS Değişkenleri ve Tema Desteği</h3>
                    <p className="text-gray-600 mb-4">CSS değişkenleri kullanarak dinamik ve temalaştırılabilir arayüzler oluşturma.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>8 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>6 dk okuma</span>
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
        localhost:3000/blog/tailwind-css
      </div>
    </div>
  );
};

export default TailwindBlogPage;