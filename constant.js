let params = new URLSearchParams(document.location.search);
const containerRestrictionRatioParam = params.get("containerRestrictionRatio");
const moveAwayIntensityParam = params.get("moveAwayIntensity");
const postAngleIntensityParam = params.get("postAngleIntensity");
const posiblePosInSpaceParam = params.get("posiblePosInSpace");
const postcardSizeRatioParam = params.get("postcardSizeRatio");
const cardsIdsParam = params.get("cardsIds");
const hideTitleParam = params.get("hideTitle");

const rawCards = [
    { id: 1, width: 500, height: 358, alt: 'Person standing inside a tall concrete corridor with an elongated oval skylight opening to sky and tree branches.', description: { en: 'Photo by Noboru Morikawa, Teshima Art Museum' } },
    { id: 2, width: 335, height: 500, alt: 'Rocky alpine ridge with green shrubs and dwarf pines in the foreground and snow-streaked mountains in the distance.', description: { jp: '雲の平、奥スイス庭園 大自然は素晴しい自然の庭園を作 ってくれる。キバシャクナゲが可愛らしく咲いている。バックは薬師岳。 撮影藤沢健' } },
    { id: 3, width: 500, height: 337, alt: 'Aerial view of numerous small forested islands scattered across a bay glowing orange at sunset.', description: { jp: '九十九島の夕景 佐世保港外から平戸瀬戸にかけて約25kmの海上に点在する大小さまざまの島々。配置・密度・澄んだ海水とあらゆる点で多島海の美しさを見せる。特に落日の時刻には、残照 浮び上がる島影が西海のロマンを満喫させる' } },
    { id: 4, width: 500, height: 350, alt: 'Interior view of a concrete dome with a large oval opening revealing blue sky and trees, with a reflective wet floor.', description: { en: 'Photo by Ken\'ichi Suzuki Teshima Art Museum' } },
    { id: 5, width: 500, height: 337, alt: 'Mountain landscape with a vivid pink azalea-covered slope in the foreground and green and snow-capped peaks beyond.', description: { jp: '九重連山 久住山(1,787m)を中心に、最高峰である中岳(1,791m)など1,700m 級の峰々を重ね、九州本土最高峰であることから九州の屋根とも呼ばれている。天然記念物のミヤマキリマが咲き誇る初夏のほか、秋の紅葉、冬の霧氷も素晴らしい' } },
    { id: 6, width: 500, height: 350, alt: 'Sculptural stainless steel structure with an oval opening reflecting the sky, seen beneath tree branches', description: { en: 'Photo by Ken\'ichi Suzuki Teshima Art Museum' } },
    { id: 7, width: 500, height: 337, alt: 'View of a vast pink and white cosmos flower field overlooking a blue coastal bay with islands.', description: { en: 'Nokonoshima island' } },
    { id: 8, width: 500, height: 325, alt: 'Vintage black-and-white photo of a wooden torii gate beside a lake, with deers and a pagoda visible through trees.', description: { jp: '距を池池方南す綱と原ヶ茅淺を岡の帯一側右はれ入を居鳥す磨に社日春土高で居鳥の一(特名良杰)レベす掬雅古絕佳望眺りあ林梅の岡片に近附りあルテホ良奈るな社高で' } },
    { id: 9, width: 339, height: 500, alt: 'Vintage black-and-white photo of a wooden torii gate beside a lake, with birds in the sky and a pagoda visible through trees.', description: { en: 'America-mura Osaka Japan' } },
    { id: 10, width: 500, height: 341, alt: 'Postcard photo of green rolling fields leading to distant blue-gray mountains under a partly cloudy sky.', alt: 'Nighttime street scene in a shopping district with illuminated signs.', description: { en: 'National Park Mt. Aso' } },
    { id: 11, width: 500, height: 337, alt: 'Aerial view of green forested ridges and a cloud-covered valley with distant mountains under a blue sky.', description: { jp: '米塚とカルデラ (阿蘇くじゅう国立公園)' } },
    { id: 12, width: 500, height: 355, alt: 'Sepia-toned photo of a smoking volcanic crater with steam and clouds around jagged rock formations.', description: { jp: '"北海道全集" 登別地獄谷地獄谷には無数の気孔から熱湯が噴出し、まさにこの世の地獄を思わせる様相を見せている。' } },
    { id: 13, width: 500, height: 324, alt: 'Vintage black-and-white postcard of a torii gate approach lined with pine trees leading to a shrine building.', description: { en: 'The Yasukunj Shrine, Kudan, Tokyo' } },
    { id: 14, width: 500, height: 338, alt: 'Rocky alpine meadow with scattered boulders and yellow wildflowers below a mountain ridge.', description: { jp: '花で埋まる黒部五郎カールこのあたり一面、夏は高山植物のお花畠となって、素晴しい別天地となる。ダイヤモンドコースの中でもとくに楽しい場所のひとつとなっている。' } },
    { id: 15, width: 337, height: 500, alt: 'Reflection photo of a rocky, moss-covered shoreline against blue sky and clouds.', description: { jp: '双六岳より望む槍ヶ岳 なだらかな双六岳の稜線の向うに槍穂高連峰が望まれる。そのするどい岩壁と丸味を帯びた稜線の対比が美しい。 撮影 小池潜' } },
    { id: 16, width: 353, height: 500, alt: 'Night photo of the illuminated red Port of Kobe tower beside a building with colorful light beams and a full moon.', description: { jp: 'ポートタワー夜景/神戸中突提の一角にそびえるポートタワーは、高さ108m、バイブ構造からなる鼓形赤色の塔である。3階部の回転展望喫茶を含む上BB5階は、ガラス張りの展望台で、360度のパノラマ風景が一望できる。特に、神戸市街の夜景は素晴らしい。' } },
    { id: 17, width: 337, height: 500, alt: 'Aerial view of a green mountainside with winding trails through forest and shrubs.', description: { jp: '黒部源流と槍ケ岳いくすじもの谷が落ち込み黒部源流となる。鷲羽乗越の向うに槍ヶ岳が望まれる。雄大な景観である。' } },
    { id: 18, width: 500, height: 357, alt: 'Photo of the floating vermilion torii gate of Itsukushima Shrine standing in water before a forested hillside.', description: { jp: '厳島神社大鳥居正面(宮島)' } },
    { id: 19, width: 500, height: 350, alt: 'Aerial view of a forested coastal hillside with scattered buildings, roads, and a blue bay.', description: { en: '2025 Photo by Gion - Naoshima - Tadao Ando New Museum of Art' } },
    { id: 20, width: 500, height: 363, alt: 'Night photo of fireworks bursting over a river reflecting orange and teal city lights.', description: { en: 'Night View of the Movement of Aomori Nebuta on the Sea / Nebuta Festival' } },
    { id: 21, width: 335, height: 500, alt: 'Black-and-white photo of a concrete staircase leading up toward a triangular skylight opening.', description: { en: '2025 Photo by Naoya Hatakeyama - Naoshima - Tadao Ando New Museum of Art' } },
    { id: 22, width: 500, height: 361, alt: 'Two hikers in colorful jackets standing on a grassy ridge overlooking a lake with mountain reflections.', description: { en: 'Takeshita Central/Kusasenri Central Park - Distant View of Mount Nakadake, Mountain Range of Aso from Kusasenri Plain' } },
    { id: 23, width: 361, height: 500, alt: 'Low-angle view of a white church steeple with pointed spire framed by trees and orange flowers against a blue sky.', description: { en: 'Oura Catholic Church Nagasaki' } },
    { id: 24, width: 500, height: 361, alt: 'Aerial photo of rugged, striated mountain ridges partially obscured by clouds under a blue sky.', description: { en: 'Large Crater of Mount Aso' } },
    { id: 25, width: 500, height: 361, alt: 'Painted or hand-tinted landscape of a forest with autumn-colored red and orange foliage along a calm river.', description: { en: 'Views of Lake Okotanpe (Lake Shikotu National Park)' } },
    { id: 26, width: 500, height: 357, alt: 'Postcard photo of a sandy beach with two people, footprints in sand, dune grass, and cumulus clouds over the ocean.', description: { en: 'Ishigaki Island Okinawa (photographs by Junko Hirai)' } },
]
const cardsIds = cardsIdsParam ? cardsIdsParam.split(',').map(Number) : [];
export const cards = shuffle(cardsIds.length === 0 ? rawCards : rawCards.filter(c => cardsIds.includes(c.id)))
export const mouse = { x: 0, y: 0 }
export const containerRestrictionRatio = containerRestrictionRatioParam ? Number(containerRestrictionRatioParam) : 0.6;
export const moveAwayIntensity = moveAwayIntensityParam ? Number(moveAwayIntensityParam) : 15;
export const postAngleIntensity = postAngleIntensityParam ? Number(postAngleIntensityParam) : 12;
export const posiblePosInSpace = posiblePosInSpaceParam ? Number(posiblePosInSpaceParam) : 30;
export const postcardSizeRatio = postcardSizeRatioParam ? Number(postcardSizeRatioParam) : 0.3;
export const hideTitle = hideTitleParam ? Boolean(hideTitleParam) : false;

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}