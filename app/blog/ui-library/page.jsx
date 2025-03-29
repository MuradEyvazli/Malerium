'use client'
import React from 'react';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout - Using Grid instead of flex for better control */}
      <div className="grid grid-cols-12">
        {/* Main Content Column with correct left margin  */}
        <div className="col-span-12">
          {/* Hero Section */}
          <header className="relative h-80 pt-16 bg-gradient-to-b from-black to-gray-800">
            <div className="absolute inset-0 z-0">
            <div className="absolute top-4 left-4 z-20">
              <a href="/blog" className="flex items-center text-white  hover:bg-gray-900 transition-colors py-2 px-4 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Geri Dön
              </a>
            </div>
              
            </div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
              <h1 className="text-4xl font-bold mb-4 text-white">Bileşen Kütüphanelerinin Evrimi</h1>
              <p className="text-gray-300 max-w-3xl">
                React bileşen kütüphaneleri uzun zamandır React ekosisteminin bir temel taşı olarak, geliştiricilere uygulamalara hızla entegre edilebilen önceden oluşturulmuş UI öğeleri sağlıyor.
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
                  <span>23 Mart 2025</span>
                  <span className="mx-2">•</span>
                  <span>12 dk okuma</span>
                </div>

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <p>
                    Bileşen kütüphaneleri uzun zamandır React ekosisteminin bir temel taşı olarak, geliştiricilere uygulamalara hızla entegre edilebilen önceden oluşturulmuş UI öğeleri sağlıyor. Ancak, çoğu geleneksel kütüphane dezavantajlarla birlikte geliyor: genellikle belirli stil kısıtlamaları dayatıyorlar, özelleştirmesi zor oluyorlar veya büyük paket boyutlarıyla sonuçlanıyorlar.
                  </p>
                
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                    <blockquote className="italic text-blue-800 m-0">
                      "Yeniden kullanılabilir bileşenler oluşturmak, modern web uygulaması geliştirmenin özüdür. Bu yaklaşım, geliştirme hızını artırırken tutarlı bir kullanıcı deneyimi sağlar."
                    </blockquote>
                  </div>
                
                  <p>
                    İşte burada shadcn/ui devreye giriyor, geliştiricilerin yeniden kullanılabilir UI bileşenleri hakkındaki düşünme şeklini değiştiren devrim niteliğinde bir yaklaşım sunuyor.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Paradigma: "Bir Bileşen Kütüphanesi Değil"</h2>
                  <p>
                    shadcn/ui'yi benzersiz kılan şey, yenilikçi dağıtım yöntemidir. Geliştiriciler, bir paketten önceden oluşturulmuş bileşenleri içe aktarmak yerine, bileşen kaynak kodunu doğrudan projelerine kopyalarlar. Bu yaklaşım birkaç avantaj sunar:
                  </p>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Tam Özelleştirme</h3>
                          <p className="mt-1 text-gray-600">Kodun sahibi olduğunuz için, belirli ihtiyaçlarınıza uyacak şekilde değiştirebilirsiniz</p>
                        </div>
                      </div>
                    </div>
                  
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium">Satıcı Kilidi Yok</h3>
                          <p className="mt-1 text-gray-600">Bileşenler, uygulamanızın geri kalanını etkilemeden kolayca değiştirilebilir</p>
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
                          <h3 className="text-lg font-medium">Daha Küçük Paket Boyutları</h3>
                          <p className="mt-1 text-gray-600">Yalnızca gerçekten kullandığınız bileşenleri dahil edersiniz</p>
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
                          <h3 className="text-lg font-medium">Daha İyi Geliştirici Deneyimi</h3>
                          <p className="mt-1 text-gray-600">Kaynak koduna tam erişim, hata ayıklama ve genişletmeyi basitleştirir</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-10 mb-4">Teknoloji Yığını</h2>
                  <p>
                    shadcn/ui, dikkatle seçilmiş modern teknolojiler yığını üzerine inşa edilmiştir. Bu teknolojiler, bileşen kütüphanesinin temelini oluşturur ve ona benzersiz özellikleri ve avantajları kazandırır.
                  </p>
                  
                  <div className="relative my-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Temel Teknoloji Yığını</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.275-.072-.314.496-.165.588-.201 1.101-.493.056-.034.129-.021.186.021l1.87 1.12c.067.034.165.034.234 0l7.301-4.237c.068-.034.111-.101.111-.18V7.767c0-.074-.044-.142-.111-.181l-7.301-4.224c-.068-.035-.156-.035-.22 0L4.578 7.43c-.066.036-.11.104-.11.18v8.464c0 .073.044.141.11.18l2 1.16c1.08.542 1.748-.096 1.748-.739V8.502c0-.117.089-.207.207-.207h.928c.114 0 .209.09.209.207v8.263c0 1.44-.779 2.273-2.138 2.273-.413 0-.737 0-1.654-.452l-1.88-1.08c-.468-.272-.752-.773-.752-1.313V7.767c0-.535.288-1.04.752-1.307l7.3-4.223c.455-.26.063-.26 1.54 0l7.3 4.223c.459.267.752.772.752 1.307v8.464c0 .535-.292 1.036-.752 1.307l-7.3 4.237c-.245.136-.501.204-.772.204" />
                              <path d="M14.256 13.43c-3.2 0-3.866-1.47-3.866-2.715 0-.116.09-.207.207-.207h.942c.104 0 .193.073.207.175.138.963.557 1.45 2.51 1.45 1.551 0 2.206-.35 2.206-1.175 0-.479-.186-.83-2.588-1.064-2.006-.201-3.248-.646-3.248-2.264 0-1.493 1.256-2.382 3.36-2.382 2.366 0 3.529.823 3.677 2.588.006.073-.02.139-.067.19-.048.047-.114.077-.187.077h-.955c-.1 0-.188-.069-.205-.166-.233-1.055-.79-1.396-2.262-1.396-1.667 0-1.86.583-1.86 1.013 0 .528.228.68 2.507.98 2.268.302 3.329.73 3.329 2.338 0 1.61-1.334 2.552-3.652 2.552" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">React</h4>
                            <p className="text-sm text-gray-600">Tüm bileşenler için temel, komponent-tabanlı UI kütüphanesi</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 16.5v2.25h2.25v-2.25H3Zm4.5 0v2.25h2.25v-2.25H7.5Zm4.5 0v2.25h2.25v-2.25H12Zm4.5 0v2.25h2.25v-2.25H16.5ZM3 12v2.25h2.25V12H3Zm4.5 0v2.25h2.25V12H7.5Zm4.5 0v2.25h2.25V12H12Zm4.5 0v2.25h2.25V12H16.5ZM3 7.5v2.25h2.25V7.5H3Zm4.5 0v2.25h2.25V7.5H7.5Zm4.5 0v2.25h2.25V7.5H12Zm4.5 0v2.25h2.25V7.5H16.5Z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">TypeScript</h4>
                            <p className="text-sm text-gray-600">Tip güvenliği ve gelişmiş geliştirici deneyimi için</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Tailwind CSS</h4>
                            <p className="text-sm text-gray-600">Yüksek düzeyde özelleştirilebilir yardımcı program öncelikli stil sağlar</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5zM9.63 18.57l-2.97-8.1a1.485 1.485 0 012.91-.61l1.65 4.5 1.65-4.5a1.485 1.485 0 012.91.61l-2.97 8.1a1.485 1.485 0 01-3.18 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Radix UI</h4>
                            <p className="text-sm text-gray-600">Stil uygulanmamış, erişilebilir bileşen ilkelleri</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-4">Geleceğe Bakış</h2>
                  <p>
                    Web geliştirme evolüsyona devam ederken, shadcn/ui'nin arkasındaki ilkeler —sahiplik, özelleştirme ve geliştirici deneyimi— gelecekte UI bileşenlerini nasıl oluşturduğumuzu ve paylaştığımızı etkilemeye devam edecektir. Bu yaklaşım, çeşitli web projelerinde kullanılabilecek daha esnek, sürdürülebilir ve erişilebilir UI bileşenlerinin oluşturulmasını teşvik ediyor.
                  </p>
                </article>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                  <h3 className="text-lg font-semibold mb-4">İçindekiler</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-blue-600 font-medium">Bileşen Kütüphanelerinin Evrimi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Yeni Paradigma</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Teknoloji Yığını</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Erişilebilirlik Önceliği</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Gerçek Dünya Etkisi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Geleceğe Bakış</a></li>
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">İlgili Makaleler</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/ui-library/az.jpg" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Tailwind CSS: Utility-First Devrimi</h4>
                              <p className="text-xs text-gray-500 mt-1">14 Mart 2025</p>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="group">
                          <div className="flex items-start">
                            <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                              <img src="/assets/news/ui-library/bz.png" alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">React 19: Yeni Özelliklere Genel Bakış</h4>
                              <p className="text-xs text-gray-500 mt-1">2 Mart 2025</p>
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
                      src="/assets/news/ui-library/cz.png" 
                      alt="React" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">React: Komponent Tabanlı UI'ın Öncüsü</h3>
                    <p className="text-gray-600 mb-4">React'ın bileşen tabanlı mimarisiyle modern web geliştirmeyi nasıl şekillendirdiğini keşfedin.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>15 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>8 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/ui-library/dz.png" 
                      alt="Tailwind CSS" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Tailwind CSS: Utiliy-First Devrim</h3>
                    <p className="text-gray-600 mb-4">Tailwind CSS'in geliştiricilerin uygulamalarını nasıl şekillendirdiğini ve CSS yaklaşımlarını nasıl değiştirdiğini inceleyin.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>10 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>6 dk okuma</span>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="/assets/news/ui-library/ez.png" 
                      alt="Next.js" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Next.js: Üretim için React Framework'ü</h3>
                    <p className="text-gray-600 mb-4">Next.js'in tam yığın React uygulamaları oluşturmak için nasıl tercih edilen framework haline geldiğini keşfedin.</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>5 Mart 2025</span>
                      <span className="mx-2">•</span>
                      <span>10 dk okuma</span>
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
        <button className="h-14 w-14 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-lg hover:bg-yellow-600 transition-colors">
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

export default BlogPage;