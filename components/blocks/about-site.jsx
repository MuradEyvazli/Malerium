'use client';
import { GridMotion } from "@/components/ui/grid-motion"

export function GridMotionDemo() {
  const items = [
    'https://images.pexels.com/photos/25810976/pexels-photo-25810976/free-photo-of-gunes-gozlugu-kahvalti-canak-kase.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30323030/pexels-photo-30323030/free-photo-of-kopenhag-da-buyuleyici-aksam-sokak-lambasi.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/30254376/pexels-photo-30254376/free-photo-of-serinletici-limon-feslegenli-su-icecegi.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30332025/pexels-photo-30332025/free-photo-of-avusturya-alplerinden-buzlu-posta-kutusu.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30110558/pexels-photo-30110558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/29984356/pexels-photo-29984356/free-photo-of-kuru-cicek-tutan-kadinin-vintage-portresi.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/6864554/pexels-photo-6864554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30267024/pexels-photo-30267024/free-photo-of-tarihi-eski-quebec-te-buyuleyici-sokak-manzarasi.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/11116397/pexels-photo-11116397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30283085/pexels-photo-30283085/free-photo-of-karli-avusturya-daglari-uzerindeki-bos-kayak-asansoru.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/10320391/pexels-photo-10320391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30222858/pexels-photo-30222858/free-photo-of-isvicre-alpleri-nin-ve-rustik-salelerin-nefes-kesen-manzarasi.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/9620214/pexels-photo-9620214.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30227163/pexels-photo-30227163/free-photo-of-eski-quebec-sehrinde-buyuleyici-tarihi-catilar.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/29946756/pexels-photo-29946756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/29983748/pexels-photo-29983748/free-photo-of-bormes-les-mimosas-ta-bougainvillea-li-buyuleyici-pembe-ev.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/19377629/pexels-photo-19377629/free-photo-of-meyveler-buket-vazo-naturmort.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/9976628/pexels-photo-9976628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.pexels.com/photos/30356380/pexels-photo-30356380/free-photo-of-polonya-krakow-daki-tarihi-kule.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/10320391/pexels-photo-10320391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/30222858/pexels-photo-30222858/free-photo-of-isvicre-alpleri-nin-ve-rustik-salelerin-nefes-kesen-manzarasi.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/9620214/pexels-photo-9620214.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    
];

  return (
    <div className="space-y-8">
      <div className="h-screen w-full bg-gradient-to-br from-background to-muted">
        <GridMotion 
          items={items}
          gradientColor="hsl(var(--brand))"
          className="relative z-10 backdrop-blur-sm"
        />
      </div>

     
    </div>
  )
}