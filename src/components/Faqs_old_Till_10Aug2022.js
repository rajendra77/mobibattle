import React, {useEffect} from "react";
import Text from "../commonComponents/Text";


function Faqs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="bg-primary min-w-screen flex flex-col justify-center">
        <div className="w-full bg-white border border-white">
          <div className="flex justify-center py-4">
            <Text
              tag="h4"
              scale={true}
              styles=""
              text="Gbattle-ийн түгээмэл асуултууд"
              fontweight="bold"
            />
          </div>
            <ul className="list-disc px-8">
              <div className="mt-4">
                <li className="font-bold">Би үнэгүй тоглож болох уу?</li>
                <p>Боломжгүй, та заавал багцаа худалдан авч нэвтэрч орон тоглоно. Үнэгүй тоглоомыг хязгаарлагдсан хугацаанд хугацаатай тоглох боломжтой.</p>
              </div>
              {/* <div className="mt-4">
                <li className="font-bold">Захиалгын хүчинтэй хугацаа гэж юу вэ?</li>
                <p>Захиалга нь тухайн үнийн цагийн дагуу заасан тодорхой хугацаанд хүчинтэй байх болно. Энэ нь дараагийн тооцооны мөчлөгт автоматаар шинэчлэгдэх болно.</p>
              </div> */}
              <div className="mt-4">
                <li className="font-bold">Би яаж үнэгүй тоглоом тоглох вэ?</li>
                <p>Жагсаалтад орсон аль ч тоглоомын доор Үнэгүй тоглох дээр дарж Үнэгүй тоглоомд орох боломжтой. Gbattle танд бодит цаг хугацаанд тоглох тоглогчийг олох болно.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Яаж койн худалдаж авах вэ?</li>
                <p>Та хэтэвч гэсэн цэс рүү нэвтрэн орж, койн нэмэх дээр дарж койн худалдаж авах боломжтой. Платформ дээрх боломжит сонголтуудаас сонгоно уу.</p>
                <p className="mt-2">Тайлбар: Зоос худалдаж авах олон сонголт байж болно.</p>
              </div>
              {/* <div className="mt-4">
                <li className="font-bold">Би барьцаа дээр суурилсан тоглоомд хэрхэн орох вэ?</li>
                <p>Барьцаа дээр суурилсан тоглоом тоглохын тулд та зоос худалдаж авах хэрэгтэй болно. Хангалттай зоостой болмогц тоглоомын карт дээрх дурын дүнг сонгоход Mobibattle танд тоглоом тоглох онлайн тоглогч олох болно.</p>
                
              </div>
              <div className="mt-4">
                <li className="font-bold">Тоглоомын дундуур миний интернет тасарвал яах вэ?</li>
                <p>Та ямар ч нөхөн төлбөр авахгүйгээр тэмцээнийхээ бооцоо алдах болно. Тиймээс тоглоомын үеэр интернетийн холболтыг тогтвортой байлгахыг зөвлөж байна.</p>
              </div> */}
               <div className="mt-4">
                <li className="font-bold">Тэмцээнд оролцоход шаардагдах койныг хэрхэн төлөх вэ?</li>
                <p>Таныг өрсөлдөөнт тоглоом сонгох үед хэтэвчний үлдэгдэлээс койныг автоматаар хасна. Хэтэвчний үлдэгдэл хүрэлцэхгүй тохиолдолд танд сануулах мессеж илгээнэ.</p>
              </div>
             {/* <div className="mt-4">
                <li className="font-bold">Тоглолтын дараа Поол зоос юу болох вэ?</li>
                <p>Зоосыг ялагчийн Mobibattle түрийвч рүү шууд илгээнэ. Гэсэн хэдий ч таны хожсон зоос зөвхөн таны урамшууллын түрийвчинд нэмэгдэх болно.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Хэрэв би тоглоомонд хожигдвол миний зоос юу болох вэ?</li>
                <p>Хэрэв та тоглоомонд хожигдсон бол ялагчийн Mobibattle түрийвч рүү зоос илгээгдэх болно. </p>
              </div> */}
              <div className="mt-4">
                <li className="font-bold">Шагналын койныг хэрхэн буцааж нэгж болгон авах вэ??</li>
                <p>Та бүртгэлтэй утасны дугаарын дансанд хожсон койныг эргүүлэн нэгж болгон авах боломжтой.</p>
              </div>
              {/* <div className="mt-4">
                <li className="font-bold">Миний мөнгийг урьдчилж төлсөн үлдэгдэл түрийвчнээсээ хассан боловч би зоос аваагүй бол яах вэ?</li>
                <p>Та портал дээрх манай тусламжийн хэсэгт зочилсноор бүх гүйлгээний асуулгыг шийдвэрлэх боломжтой. Манай техникийн баг асуудлыг аль болох хурдан шийдвэрлэх болно.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Хэрэв миний сүүлийн төлбөр хүлээгдэж байгаа/цуцлах шатандаа байгаа бол би дахин төлбөр хийж болох уу?</li>
                <p>Бүү сандар! Үргэлжлүүлэн өөр гүйлгээ хийнэ үү. Таны данснаас мөнгө хасагдсан хүлээгдэж буй гүйлгээг ажлын 7-10 хоногийн дотор таны банк руу буцаан шилжүүлнэ..</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Миний Mobile Money Wallet-д мөнгө авах хугацаа 7 хоног хүлээгдэж байна </li>
                <p>Энэ нь маш ховор тохиолддог. Төлбөрийн хэрэгслээр асуудал гарсан тохиолдолд бид мөнгийг Mobibattle түрийвч рүү буцаан шилжүүлнэ. Та Mobile Money дансны дэлгэрэнгүй мэдээллийг дахин оруулах шаардлагатай болно.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Урьдчилсан төлбөрт түрийвчээ цэнэглэхэд 2 хоногоос дээш хугацаанд мөнгө татан авалт хүлээгдэж байна.</li>
                <p>Та портал дээрх манай тусламжийн хэсэгт зочилсноор бүх гүйлгээний асуулгыг шийдвэрлэх боломжтой. Манай техникийн баг асуудлыг аль болох хурдан шийдвэрлэх болно.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Би захиалгаа хэрхэн цуцлах вэ?</li>
                <p>Wallet хуудас руу очно уу &gt;&gt; Миний захиалга &lt;&lt; Бүртгэлээ цуцлах</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Би захиалгаа цуцалсан тохиолдолд нөхөн төлбөр авч болох уу?</li>
                <p>Дээд ангиллын захиалгын ямар ч хувилбарт буцаан олголт хийхгүй, гэхдээ та захиалгын хугацаанд боломжоо ашиглах боломжтой.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Нэг захиалгын давуу талыг олон хэрэглэгчид ашиглах боломжтой юу?</li>
                <p>Нэг хэрэглэгчийн бүртгэлийн давуу талыг зөвхөн нэг бүртгэлтэй хэрэглэгч нэг гар утасны төхөөрөмж дээр ашиглах боломжтой бөгөөд нэг бүртгэлтэй олон төхөөрөмжид ашиглах боломжгүй.</p>
              </div> */}
             
            </ul>
          </div>
        </div>
    </>
  );
}

export default Faqs;
