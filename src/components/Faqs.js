import React, {useEffect} from "react";
import Text from "../commonComponents/Text";
import {SendGuiDataEvents} from '../commonScript';
import { reactLocalStorage } from "reactjs-localstorage";

function Faqs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    let guiDataEvent = {}
    guiDataEvent['page'] = 'faqs';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
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
                <li className="font-bold">G Battle багцаа хэрхэн идэвхжүүлэх вэ?</li>
                <p>Та www.gbattle.mn веб хуудас болон 332 тусгай дугаарт G1, G7, G30 гэсэн мессеж илгээн идэвхжүүлэх боломжтой.</p>
              </div>							
							
              <div className="mt-4">
                <li className="font-bold">Би ямар багц идэвхжүүлэх вэ?</li>
                <p>Та дараах багцуудаас идэвхжүүлэх боломжтой. </p>
              </div>
              
              {/* table */}
              <div className="mt-4">
                <li className="font-bold"> Багцын төрөл:</li>
                <table style={{ borderCollapse: "collapse"}}>
                  <tr className="border-2 mx-2">
                    <th className="border-2 px-2">Багцын нэр</th>
                    <th className="border-2 px-2">Хугацаа</th>
                    <th className="border-2 px-2">Үнэ</th>
                  </tr>
                  <tr className="border-2 mx-2">
                    <td className="border-2 px-2">1 хоногийн G Battle багц</td>
                    <td className="border-2 px-2">1 хоног</td>
                    <td className="border-2 px-2">300₮</td>
                  </tr>
                  <tr className="border-2 mx-2">
                    <td className="border-2 px-2">7 хоногийн G Battle багц</td>
                    <td className="border-2 px-2">7 хоног</td>
                    <td className="border-2 px-2">1500₮</td>
                  </tr>
                  <tr className="border-2 mx-2">
                    <td className="border-2 px-2">30 хоногийн G Battle багц</td>
                    <td className="border-2 px-2">30 хоног</td>
                    <td className="border-2 px-2">6000₮</td>
                  </tr>
                </table>
              </div>
          
              <div className="mt-4">
                <li className="font-bold"> Багцын хүчинтэй хугацаа гэж юу вэ?</li>
                <p>Таны идэвхжүүлсэн багцын төрлөөс хамаарч багцын хүчинтэй хугацаа өөр өөр байна. Та цуцлах хүсэлт гаргах хүртэл таны идэвхжүүлсэн багц автоматаар сунгагдана.</p>
                {/* <p className="mt-2">Тайлбар: Койн худалдаж авах өөр сонголтууд байж болно.</p> */}
              </div>

              <div className="mt-4">
                <li className="font-bold">G Battle багцад дата эрх дагалдах уу?</li>
                <p>Уучлаарай, G Battle багцад дата эрх дагалдахгүй та дата багцын талаар дэлгэрэнгүй мэдээлэл авах бол 235 дугаарт “help” гэсэн мессежийг илгээнэ үү.</p>
              </div>		
								
              <div className="mt-4">
                <li className="font-bold">G Battle багц идэвхжүүлсэн боловч өрсөлдөөнт тоглоом тоглож болохгүй байна.</li>
                <p>Та тухайн идэвхжүүлсэн багцыг зөвхөн www.gbattle.mn веб хуудас руу нэвтэрч ороход ашиглах ба тоглоомын өрөөнд орж энгийн болон өрсөлдөөнт тоглоомыг тоглохдоо заавал койн худалдан авсан байх шаардлагатай.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold"> Нэгжээ хэрхэн койн болгох вэ?</li>
                <p>Та www.gbattle.mn веб хуудас руу хандан “Хэтэвч” цэсэд байрлах 5 төрлийн койноос сонгон өөрийн G Battle хэтэвчийг цэнэглэх боломжтой.</p>
              </div>	
								
              <div className="mt-4">
                <li className="font-bold">Койноо нэгж болгон авах боломжтой юу? </li>
                <p>Та хожлын койноо нэгж болгох боломжтой. Дансан дахь нэгжээрээ худалдан авсан койныг буцаан нэгж болгон авах боломжгүй.</p>
              </div>			
								
              <div className="mt-4">
                <li className="font-bold">Хожлын койноо өөр дугаарт нэгж болгон авах боломжтой юу? </li>
                <p>Уучлаарай, Та www.gbattle.mn веб хуудсанд бүртгүүлсэн урьдчилсан төлбөрт үйлчилгээний дугаартаа нэгж болгон авах боломжтой.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Хожлын койноо нэгж болгон авахад хязгаар байгаа юу? </li>
                <p>Та өдөрт хамгийн багадаа 100, хамгийн ихдээ 5000 койныг нэгж болгон авах боломжтой.</p>
              </div>
              <div className="mt-4">
                <li className="font-bold">Худалдан авсан койноо хэрхэн зарцуулах вэ?</li>
                <p>Худалдан авсан койноо ашиглан тоглоомын өрөө рүү нэвтэрч бусад хэрэглэгчидтэй тоглох боломжтой.</p>
              </div>	
								
              <div className="mt-4">
                <li className="font-bold">Тоглоомын өрөөнд хэрхэн бүртгүүлэх вэ?</li>
                <p>Өрсөлдөөнт тоглоомын төрөл хэсэгт тэмцээн болох хугацааг заасан өрөөнүүд үүссэн байх ба та өөрийн G Battle хэтэвчинд байршуулсан койноо ашиглан бүртгүүлэх боломжтой.</p>
              </div>	
              <div className="mt-4">
                <li className="font-bold">Тоглоомын өрөө бүгд ижил үнэтэй юу?</li>
                <p>Тоглоомын төрлөөс хамааран таны G Battle хэтэвчнээс хасагдах койны хэмжээ өөр байна.</p>
              </div>

              <div className="mt-4">
                <li className="font-bold"> Ялагч болсон тохиолдолд урамшуулал байгаа юу?</li>
                <p>Тиймээ. Тухайн тоглолтын өрөөнд байршсан нийт койн таны G Battle хэтэвчинд хожлын койн болон орно.</p>
              </div>
 	
              <div className="mt-4">
                <li className="font-bold">Бусад операторын хэрэглэгч тоглох боломжтой юу?</li>
                <p>Тиймээ. Та “Зочин” эрхээр нэвтэрч үнэгүй тоглоомуудыг тоглох боломжтой.</p>
              </div>

              <div className="mt-4">
                <li className="font-bold">Дараа төлбөрт үйлчилгээний хэрэглэгч идэвхжүүлэх боломжтой юу? </li>
                <p>Уучлаарай зөвхөн урьдчилсан төлбөрт үйлчилгээний хэрэглэгч энэхүү үйлчилгээг ашиглах боломжтой.</p>
              </div>

              <div className="mt-4">
                <li className="font-bold">Багц идэвхжүүлээгүй бол тоглох боломжтой юу? </li>
                <p>Та хүссэн үедээ “Зочин” эрхээр нэвтэрч үнэгүй тоглоомуудыг тоглох боломжтой.</p>
              </div>

              <div className="mt-4">
                <li className="font-bold">G Battle багцыг  давхар идэвхжүүлэх боломжтой юу? </li>
                <p>Давхар идэвхжүүлэх боломжгүй. Та өмнөх багцаа цуцалсан тохиолдолд дахин багц идэвхжүүлэх боломжтой.</p>
              </div>

              <div className="mt-4">
                <li className="font-bold">G Battle хэтэвчиндээ койнтой үедээ багцаа цуцалбал койн устах уу?</li>
                <p>Хэтэвчиндээ койн эрхтэй үедээ G Battle багцаа цуцалсан тохиолдолд таны койн хадгалагдаж үлдэнэ.</p>
              </div>
	
              <div className="mt-4">
                <li className="font-bold">Багцаа хэрхэн цуцлах вэ? </li>
                <p>Та  www.gbattle.mn веб хуудас болон 332 тусгай дугаарт “Off” гэсэн мессеж илгээн цуцлах боломжтой.</p>
              </div>
              
             
            </ul>
          </div>
        </div>
    </>
  );
}

export default Faqs;
