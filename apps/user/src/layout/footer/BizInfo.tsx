type BizInfo = {
    company: string;
    ceo: string;
    bizNo: string;
    mailOrderNo: string;
    phone: string;
    email: string;
    address: string;
    domain: string;
    hostLocation: string;
    authority: string;
};

const sample: BizInfo = {
    company: "(주)Team No.1",
    ceo: "윤지연",
    bizNo: "421-17-39502",
    mailOrderNo: "2025-서울구로B-1423호",
    phone: "02-715-2294",
    email: "team_no1@recipick.co.kr",
    address: "서울특별시 구로구 경인로 557, 삼영빌딩 4층",
    domain: "www.recipick.co.kr",
    hostLocation: "서울특별시",
    authority: "서울특별시 구로구청",
};

export default function BusinessInfoTable(props: { data?: BizInfo }) {
    const data = props.data ?? sample;
    const rows: Array<[string, string]> = [
        ["상호", data.company],
        ["대표자명", data.ceo],
        ["사업자등록번호", data.bizNo],
        ["통신판매업신고", data.mailOrderNo],
        ["연락처", data.phone],
        ["전자우편(E-mail)", data.email],
        ["사업장소재지(도로명)", data.address],
        ["인터넷도메인", data.domain],
        ["호스트서버소재지", data.hostLocation],
        ["통신판매업 신고기관명", data.authority],
    ];

    return (
        <section aria-labelledby="biz-info-heading" className="max-w-3xl">
            <h2 id="biz-info-heading" className="sr-only">
                사업자 정보
            </h2>
            <table className="w-full border-collapse">
                <colgroup>
                    <col className="w-1/3" />
                    <col className="w-2/3" />
                </colgroup>
                <tbody>
                {rows.map(([label, value]) => (
                    <tr key={label}>
                        <th className="text-left bg-gray-100 p-3 border border-gray-200 align-top">
                            {label}
                        </th>
                        <td className="p-3 border border-gray-200">{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}