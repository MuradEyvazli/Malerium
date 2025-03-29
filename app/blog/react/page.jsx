'use client'
import React from 'react';

const ReactBlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout - Using Grid instead of flex for better control */}
      <div className="grid grid-cols-12">
        {/* Main Content Column with correct left margin  */}
        <div className="col-span-12">
          {/* Hero Section */}
          <header className="relative h-80 pt-16 bg-gradient-to-b from-blue-500 to-blue-600">
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
              <h1 className="text-4xl font-bold mb-4 text-white">React: Komponent Tabanlı UI'ın Öncüsü</h1>
              <p className="text-gray-300 max-w-3xl">
                React, kullanıcı arayüzü geliştirmeyi devrimleştiren, komponent tabanlı, deklaratif bir JavaScript kütüphanesidir. Yüksek performans ve kolay bakım özellikleriyle büyük ve karmaşık uygulamaların geliştirilmesini basitleştirir.
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
                  <span>15 Mart 2025</span>
                  <span className="mx-2">•</span>
                  <span>11 dk okuma</span>
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <p>
                    React, 2013 yılında Facebook (şimdi Meta) tarafından açık kaynak olarak piyasaya sürüldüğünden beri, web geliştirme dünyasında devrim yaratmıştır. Bileşen tabanlı mimari yaklaşımı, geliştiricilerin kullanıcı arayüzlerini küçük, izole, yeniden kullanılabilir parçalar halinde düşünmelerini sağlayarak, web uygulamalarının geliştirilme şeklini değiştirmiştir.
                  </p>
                
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                    <blockquote className="italic text-blue-800 m-0">
                      "React'ın temel prensibi basittir: UI'nizi bağımsız, izole bileşenler olarak düşünün ve bu bileşenleri daha karmaşık arayüzler oluşturmak için birleştirin. Bu yaklaşım, kodunuzu organize, test edilebilir ve bakımı kolay hale getirir."
                    </blockquote>
                  </div>
                
                  <p>
                    React'ın en güçlü yönlerinden biri, Virtual DOM kullanarak DOM manipülasyonlarını optimize etmesi ve uygulamaların performansını artırmasıdır. Ayrıca, deklaratif programlama paradigması, geliştiricilerin neyin nasıl değişmesi gerektiğini değil, kullanıcı arayüzünün belirli bir durumda nasıl görünmesi gerektiğini belirtmelerine olanak tanır.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">React'ın Temel Konseptleri</h2>
                  <p>
                    React'ın gücü, basit ama güçlü birkaç temel konsepte dayanır. Bu konseptler, React geliştirmeyi anlamanın ve etkili bir şekilde kullanmanın temelidir:
                  </p>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Komponentler</h3>
                          <p className="mt-1 text-gray-600">React, kullanıcı arayüzünüzü bağımsız, yeniden kullanılabilir parçalara ayırmanıza olanak tanır</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">JSX</h3>
                          <p className="mt-1 text-gray-600">JavaScript'i HTML benzeri bir sözdizimi ile genişleterek UI'yi daha sezgisel bir şekilde tanımlamanızı sağlar</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Tek Yönlü Veri Akışı</h3>
                          <p className="mt-1 text-gray-600">Veriler, üst komponentlerden alt komponentlere tek yönlü akar, bu da uygulamanızı daha öngörülebilir hale getirir</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Virtual DOM</h3>
                          <p className="mt-1 text-gray-600">React, UI değişikliklerini optimize ederek performansı artıran hafif bir DOM kopyası tutar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Modern React'ta Hooks</h2>
                  <p>
                    React 16.8 ile tanıtılan Hooks, React'ın class komponentlerinde mevcut olan özelliklere daha basit bir şekilde erişmenize olanak tanıyan fonksiyonlardır. Hooks, class komponentlerine gerek kalmadan durum (state) yönetimi, yan etkiler (effects) ve daha fazlasını kullanmanıza olanak tanır.
                  </p>
                  
                  <div className="relative my-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">En Çok Kullanılan React Hooks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">useState</h4>
                            <p className="text-sm text-gray-600">Fonksiyonel komponentlerde durum (state) değişkenlerini tanımlamanıza ve yönetmenize olanak tanır</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">useEffect</h4>
                            <p className="text-sm text-gray-600">Yan etkileri gerçekleştirmenizi sağlar, örneğin veri getirme, abonelikler veya DOM manipülasyonları</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">useContext</h4>
                            <p className="text-sm text-gray-600">Context verilerine erişmenize olanak tanır, bu da prop drilling'e gerek kalmadan komponentler arasında veri paylaşmanın bir yolunu sunar</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.999 17c1.099 0 1.999.9 1.999 2s-.9 2-1.999 2-1.999-.9-1.999-2 .9-2 1.999-2zm0-16c1.099 0 1.999.9 1.999 2s-.9 2-1.999 2-1.999-.9-1.999-2 .9-2 1.999-2zm0 8c1.099 0 1.999.9 1.999 2s-.9 2-1.999 2-1.999-.9-1.999-2 .9-2 1.999-2zm-8 8c1.099 0 1.999.9 1.999 2s-.9 2-1.999 2-1.999-.9-1.999-2 .9-2 1.999-2zm0-8c1.099 0 1.999.9 1.999 2s-.9 2-1.999 2-1.999-.9-1.999-2 .9-2 1.999-2zm0-8c1.099 0 1.999.9 1.999 2s-.9 2-1.999 2-1.999-.9-1.999-2 .9-2 1.999-2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">useMemo ve useCallback</h4>
                            <p className="text-sm text-gray-600">Performansı optimize etmenize yardımcı olur, özellikle hesaplama açısından pahalı işlemlerde ve yeniden render'ları azaltarak</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-4">React Ekosistemi</h2>
                  <p>
                    React'ın geniş ekosistemi, geliştiricilerin karmaşık uygulamalar oluşturmasını kolaylaştıran sayısız kütüphane ve araç içerir. Bu araçların bazıları React ekibi tarafından geliştirilirken, diğerleri topluluk tarafından oluşturulmuştur.
                  </p>
                  
                  <p>
                    Popüler ekosistem araçları arasında Redux ve MobX gibi durum yönetim kütüphaneleri, React Router gibi gezinme çözümleri ve Material-UI ve Chakra UI gibi UI framework'leri bulunur. Ayrıca, Next.js ve Gatsby gibi React'ı temel alan framework'ler, React geliştirme deneyimini daha da geliştirmek için ortaya çıkmıştır.
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Geleceğe Bakış</h2>
                  <p>
                    React, web geliştirme dünyasında bir temel taş haline gelmiştir ve sürekli olarak gelişmeye devam etmektedir. Concurrent Mode ve Server Components gibi yeni özellikler, React uygulamalarını daha da hızlı ve ölçeklenebilir hale getirme sözü veriyor.
                  </p>
                  
                  <p>
                    Sonuç olarak, React yalnızca bir JavaScript kütüphanesi değil, aynı zamanda modern web uygulamaları oluşturmaya yönelik güçlü bir felsefedir. Bileşen tabanlı mimari, deklaratif programlama ve tek yönlü veri akışı prensipleri, geliştiricilerin kompleks kullanıcı arayüzlerini daha kolay bir şekilde oluşturmasına ve bakımını yapmasına olanak tanıyor.
                  </p>
                </article>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                  <h3 className="text-lg font-semibold mb-4">İçindekiler</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-blue-600 font-medium">React: Komponent Tabanlı UI'ın Öncüsü</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">React'ın Temel Konseptleri</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Modern React'ta Hooks</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">React Ekosistemi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Geleceğe Bakış</a></li>
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">İlgili Makaleler</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/react/aq.png" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">React Hooks Derinlemesine İnceleme</h4>
                              <p className="text-xs text-gray-500 mt-1">20 Mart 2025</p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/react/bq.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">React vs Vue: Modern Framework'lerin Karşılaştırması</h4>
                              <p className="text-xs text-gray-500 mt-1">10 Mart 2025</p>
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
                      src="/assets/news/react/cq.png" 
                      alt="React Hooks" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">React Hooks: Fonksiyonel Komponentlerin Gücü</h3>
                    <p className="text-gray-600 mb-4">React Hooks ile fonksiyonel komponentlerde state ve lifecycle özelliklerini nasıl kullanabileceğinizi keşfedin.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>17 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>8 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/react/dq.png" 
                      alt="React State Management" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">React'ta Modern State Yönetimi</h3>
                    <p className="text-gray-600 mb-4">Redux, Context API ve Recoil gibi state yönetim çözümlerini karşılaştırın ve hangi durumda hangisinin kullanılacağını öğrenin.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>10 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>11 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/react/eq.jpg" 
                      alt="React Performance" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">React Performans Optimizasyonu</h3>
                    <p className="text-gray-600 mb-4">React uygulamalarınızı daha hızlı ve verimli hale getirmek için performans optimizasyon teknikleri ve best practice'ler.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>5 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>9 dk okuma</span>
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
        localhost:3000/blog/react
      </div>
    </div>
  );
};

export default ReactBlogPage;