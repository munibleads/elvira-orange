import Image from 'next/image';

export default function CardFive() {
  return (
    <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/Elvira-ar.png"
        alt="Elvira Arabic"
        width={150}
        height={150}
        className="object-contain max-h-[75px]"
      />
      <Image
        src="/elviralogoicon.png"
        alt="Elvira Logo"
        width={600}
        height={600}
        className="object-contain mb-4"
      />
      <Image
        src="/Elvira-en.png"
        alt="Elvira English"
        width={150}
        height={150}
        className="object-contain max-h-[75px]"
      />
    </div>
  );
}
