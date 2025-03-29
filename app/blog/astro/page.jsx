'use client'
import React from 'react';

const AstroBlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout - Using Grid instead of flex for better control */}
      <div className="grid grid-cols-12">
        {/* Main Content Column with correct left margin  */}
        <div className="col-span-12">
          {/* Hero Section */}
          <header className="relative h-80 pt-16 bg-gradient-to-b from-purple-900 to-indigo-800">
            {/* Geri Dönme Tuşu */}
            <div className="absolute top-4 left-4 z-20">
              <a href="/blog" className="flex items-center text-white  hover:bg-purple-700 transition-colors py-2 px-4 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Geri Dön
              </a>
            </div>
            <div className="absolute inset-0 z-0">
              
            </div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
              <h1 className="text-4xl font-bold mb-4 text-white">Astro: Modern Web İçin Hızlı ve İçerik Odaklı Framework</h1>
              <p className="text-gray-300 max-w-3xl">
                Astro, modern web için tasarlanmış bir statik site oluşturucusu ve full-stack framework'tür. İçerik odaklı web siteleri için optimize edilmiş, düşük JavaScript yükü ve benzersiz çoklu framework desteği sunar.
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
                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2">
                      <span>ME</span>
                    </div>
                    <span className="font-medium">Murad Eyvazli</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>10 Mart 2025</span>
                  <span className="mx-2">•</span>
                  <span>9 dk okuma</span>
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <p>
                    Astro, 2021 yılında piyasaya sürülen modern bir web framework'üdür. "İçerik öncelikli" bir web geliştirme yaklaşımı benimseyerek, bloglar, e-ticaret siteleri, belgelendirme siteleri ve pazarlama siteleri gibi içerik odaklı projeler için optimize edilmiştir. Astro'nun başarısının ardındaki temel ilke basittir: sadece gerektiğinde JavaScript gönder, bu da "Islands Architecture" olarak bilinen bir yaklaşımdır.
                  </p>
                
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
                    <blockquote className="italic text-purple-800 m-0">
                      "Bir web sitesi yapıyorsanız, Astro'dan daha hızlı bir web framework'ü yoktur. Statik HTML olarak oluşturulan sayfalara seçici JavaScript hidrasyonu ile Astro, olabilecek en düşük JavaScript yüklemesiyle başlar."
                    </blockquote>
                  </div>
                
                  <p>
                    Astro'nun ayırt edici özelliklerinden biri, birden fazla framework'ü bir arada kullanma yeteneğidir. Astro, geliştiricilerin aynı proje içinde React, Preact, Svelte, Vue, SolidJS, AlpineJS ve Lit komponentlerini karıştırıp eşleştirmelerine olanak tanır. Bu esneklik, geliştiricilerin her görev için en iyi aracı seçmelerine ve mevcut komponent kütüphanelerini yeniden kullanmalarına olanak tanır.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Astro'nun Temel Özellikleri</h2>
                  <p>
                    Astro, web geliştirmeye benzersiz bir yaklaşım getiren birçok özellik sunar. İşte Astro'yu diğer web framework'lerinden ayıran temel özelliklerin bir özeti:
                  </p>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Islands Architecture</h3>
                          <p className="mt-1 text-gray-600">Statik HTML'nin yanında izole, interaktif UI komponentleri ile kısa yükleme süreleri</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Sıfır JavaScript Varsayılanı</h3>
                          <p className="mt-1 text-gray-600">Sayfalar varsayılan olarak sıfır JavaScript ile render edilir, performans için optimize edilmiştir</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Çoklu Framework Desteği</h3>
                          <p className="mt-1 text-gray-600">React, Vue, Svelte, Solid ve diğerlerini aynı projeye entegre etme yeteneği</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Content Collections</h3>
                          <p className="mt-1 text-gray-600">Markdown, MDX ve diğer içerik dosyaları için type-safe API'ler ve frontmatter doğrulama</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Astro'nun Çalışma Prensibi</h2>
                  <p>
                    Astro, hem statik site oluşturma (SSG) hem de sunucu taraflı rendering (SSR) desteği sunar. Astro'nun temel çalışma mantığını anlamak için, işte build sürecinin nasıl işlediği:
                  </p>
                  
                  <div className="relative my-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Astro Build Süreci</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-purple-600">1</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Komponentleri Yükleme</h4>
                            <p className="text-sm text-gray-600">Astro .astro, .md, .mdx dosyalarını ve diğer UI framework komponentlerini (React, Vue, vb.) yükler</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-purple-600">2</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Sunucuda Rendering</h4>
                            <p className="text-sm text-gray-600">Tüm komponentler, UI framework olanlar dahil, sunucuda statik HTML'ye render edilir</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-purple-600">3</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">JavaScript'i Kaldırma</h4>
                            <p className="text-sm text-gray-600">Astro, client:* yönergeleri olmayan JavaScript'i kaldırır, sadece statik HTML kalır</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-purple-600">4</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Hidrasyon Yönergelerini İşleme</h4>
                            <p className="text-sm text-gray-600">client:* yönergeleri olan komponentler için hidrasyon kodu üretilir (örn., client:load, client:idle)</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-purple-600">5</span>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Optimizasyon</h4>
                            <p className="text-sm text-gray-600">HTML minify edilir, varlıklar optimize edilir ve final site oluşturulur</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-4">Content Collections: İçerik Yönetimi</h2>
                  <p>
                    Astro 2.0 ile tanıtılan Content Collections, içerik odaklı web siteleri için içerik yönetimini kolaylaştıran güçlü bir özelliktir. Content Collections, özellikle blog yazıları, belgeler veya ürün açıklamaları gibi yapılandırılmış içeriklerle çalışırken, type-safety ve organizasyon sağlar.
                  </p>
                  
                  <p>
                    Collections, TypeScript şemaları kullanarak frontmatter doğrulaması sağlar, bu da sadece doğru ve beklenen verilerin oluşturma sürecine girmesini sağlar. Bu, özellikle ekiplerde çalışırken veya CMS entegrasyonları ile çalışırken değerli bir özelliktir.
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Astro SSR ve Adaptörler</h2>
                  <p>
                    Astro 1.0 ile birlikte, Astro artık sadece statik site oluşturucu değil, aynı zamanda sunucu taraflı rendering (SSR) desteği de sunan tam teşekküllü bir web framework'üdür. SSR desteği, Astro adaptörleri aracılığıyla sağlanır, bu da Astro uygulamalarının Vercel, Netlify, Deno Deploy ve Node.js gibi çeşitli sunucu ortamlarında çalışmasına olanak tanır.
                  </p>
                  
                  <p>
                    SSR, dinamik içerik, kimlik doğrulama, koşullu renderingi ve daha fazlasını içeren etkileşimli web uygulamaları oluşturmak için yararlıdır. Astro SSR, Astro'nun hız ve minimal JavaScript ilkelerine sadık kalarak bu özellikleri sunar.
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Astro vs. Diğer Framework'ler</h2>
                  <p>
                    Astro'nun diğer framework'lere göre temel avantajı, performans ve esnekliği dengelemesidir. Next.js, Gatsby veya Nuxt gibi framework'ler ile karşılaştırıldığında, Astro daha fazla içerik odaklıdır ve varsayılan olarak daha az JavaScript gönderir.
                  </p>
                  
                  <p>
                    Ancak, Astro her türlü proje için en iyi seçim olmayabilir. Büyük ölçekli, dinamik uygulamalar için Next.js veya Nuxt daha uygun olabilir. Astro'nun güçlü yanı, statik sitelerde, bloglarda, pazarlama sitelerinde ve daha fazla içerikle daha az etkileşim gerektiren projelerde yatmaktadır.
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Geleceğe Bakış</h2>
                  <p>
                    Astro, sürekli gelişen bir framework'tür ve aktif bir topluluk tarafından desteklenmektedir. Roadmap, yaklaşan sürümler için birçok heyecan verici özellik gösteriyor, bunlar arasında View Transitions API entegrasyonu, daha fazla adaptör ve daha iyi etkileşimli geliştirme deneyimi bulunuyor.
                  </p>
                  
                  <p>
                    Sonuç olarak, Astro modern web için content-first bir yaklaşım getiriyor. Minimal JavaScript, framework-agnostik yapı ve optimize edilmiş performans ile Astro, özellikle içerik odaklı web projeleri için mükemmel bir seçimdir.
                  </p>
                </article>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                  <h3 className="text-lg font-semibold mb-4">İçindekiler</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-purple-600 font-medium">Astro: Modern Web İçin Hızlı ve İçerik Odaklı Framework</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Astro'nun Temel Özellikleri</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Astro'nun Çalışma Prensibi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Content Collections: İçerik Yönetimi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Astro SSR ve Adaptörler</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Astro vs. Diğer Framework'ler</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Geleceğe Bakış</a></li>
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">İlgili Makaleler</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/astro/b.png" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Astro ile Blog Sitesi Oluşturma Rehberi</h4>
                              <p className="text-xs text-gray-500 mt-1">22 Mart 2025</p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/astro/c.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">Static Site Generator'ler Karşılaştırması</h4>
                              <p className="text-xs text-gray-500 mt-1">14 Mart 2025</p>
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
                      src="/assets/news/astro/a.png" 
                      alt="MDX Integration" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Astro ile MDX Kullanımı</h3>
                    <p className="text-gray-600 mb-4">MDX'in Astro ile entegrasyonu ve interaktif belgelendirme siteleri oluşturmak için kullanımı.</p>
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
                      src="/assets/news/astro/d.png" 
                      alt="Islands Architecture" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Islands Architecture Derinlemesine</h3>
                    <p className="text-gray-600 mb-4">Islands Architecture'ın nasıl çalıştığını ve web performansını iyileştirmek için kullanım senaryolarını keşfedin.</p>
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
                      src="/assets/news/astro/e.jpg" 
                      alt="Astro Tailwind" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Astro + Tailwind CSS: Mükemmel İkili</h3>
                    <p className="text-gray-600 mb-4">Astro projelerinize Tailwind CSS'i entegre etmek ve şık, performanslı web siteleri oluşturmak.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>8 Mart 2025</span>
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
        <button className="h-14 w-14 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      {/* Development Mode Indicator */}
      <div className="fixed bottom-0 left-0 bg-gray-800 text-white text-xs py-1 px-3 z-50">
        localhost:3000/blog/astro
      </div>
    </div>
  );
};

export default AstroBlogPage;