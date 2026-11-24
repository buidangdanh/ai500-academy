window.LESSON_DETAILS = window.LESSON_DETAILS || {};

Object.assign(window.LESSON_DETAILS, {
  "B1": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, bước sang Học phần B, chúng ta bắt đầu chạm vào trái tim của hầu hết các dự án Generative AI doanh nghiệp hiện nay: kiến trúc RAG (Retrieval-Augmented Generation). Thực tế khi đi tư vấn cho ngân hàng hay tập đoàn bán lẻ, khách hàng không bao giờ hỏi thầy 'GPT biết làm thơ không?', mà họ hỏi: 'Làm sao để AI trả lời đúng quy chế tín dụng nội bộ cập nhật sáng nay và tuyệt đối không bịa số liệu?'. Trong đề thi AI-103, RAG không chỉ là một khái niệm lý thuyết mà xuất hiện dày đặc qua các câu hỏi về chiến lược cắt văn bản (chunking), chọn mô hình nhúng (embedding) và ép mô hình trích dẫn nguồn (grounding & citations).",
    analogy: {
      title: "Kỳ thi mở sách có dán giấy ghi chú màu (Post-it)",
      body: "Em hãy hình dung LLM giống như một sinh viên cực kỳ thông minh nhưng trí nhớ chỉ dừng lại ở thời điểm tốt nghiệp (knowledge cutoff) và chưa từng đọc nội quy riêng của công ty em. Thay vì bắt cậu sinh viên ấy học thuộc lòng lại từ đầu bằng cách phẫu thuật não (Fine-tuning rất tốn kém), em cho cậu ấy thi mở sách (RAG). Nhưng nếu ném cả cuốn sổ tay dày 2.000 trang lên bàn thì cậu ấy đọc không kịp giờ; vì vậy em phải chia cuốn sách thành từng thẻ nhỏ có đánh dấu mục lục rõ ràng (Chunking & Indexing), khi có câu hỏi chỉ rút đúng 5 thẻ liên quan nhất đưa cho cậu ấy đọc và yêu cầu ghi rõ 'Trích trang mấy' vào bài làm (Grounding & Citations)."
    },
    objectives: [
      "Hiểu sâu bản chất tại sao phải dùng RAG thay vì Fine-tuning khi làm việc với dữ liệu doanh nghiệp biến động liên tục.",
      "Thiết kế được chiến lược Chunking và Overlap tối ưu để không làm đứt gãy ngữ cảnh câu văn hoặc bảng biểu.",
      "Nắm vững cơ chế Vector Embeddings, phép đo độ tương đồng Cosine Similarity và kỹ thuật khóa chặt câu trả lời vào ngữ cảnh (Grounding & Citations)."
    ],
    flow: [
      {
        step: "1. Ingestion & Chunking (Nạp và Cắt nhỏ tài liệu)",
        detail: "Trích xuất văn bản từ PDF/Word/Wiki nội bộ, chia thành các đoạn nhỏ (chunks) khoảng 300–800 tokens kèm phần gối đầu (overlap 10–15%) và gắn siêu dữ liệu (metadata như tên file, số trang, phòng ban)."
      },
      {
        step: "2. Vectorization (Tạo Vector Embeddings)",
        detail: "Đưa từng đoạn chunk đi qua mô hình nhúng (như text-embedding-3-small hoặc text-embedding-3-large trên Microsoft Foundry) để biến văn bản thành mảng số thực nhiều chiều đại diện cho ý nghĩa ngữ nghĩa."
      },
      {
        step: "3. Retrieval (Truy xuất ngữ nghĩa theo câu hỏi)",
        detail: "Khi người dùng đặt câu hỏi, hệ thống nhúng câu hỏi đó bằng CÙNG MỘT mô hình embedding rồi đo khoảng cách Cosine Similarity để lấy ra Top-K đoạn văn bản gần nghĩa nhất."
      },
      {
        step: "4. Grounded Generation (Sinh câu trả lời kèm trích dẫn)",
        detail: "Ghép Top-K đoạn văn bản vào System/User Prompt với chỉ thị nghiêm ngặt: chỉ trả lời dựa trên tài liệu được cung cấp, đính kèm mã trích dẫn [doc1], nếu không đủ thông tin phải từ chối lịch sự."
      }
    ],
    sections: [
      {
        heading: "1. Tại sao doanh nghiệp cần RAG và nghệ thuật Chunking không làm gãy nghĩa?",
        paragraphs: [
          "Nhiều học viên mới học thường nhầm tưởng muốn AI biết dữ liệu công ty thì phải đem mô hình đi Fine-tuning. Điểm mấu chốt thầy muốn em nhớ: Fine-tuning dạy cho mô hình 'cách nói chuyện, văn phong hoặc định dạng đầu ra chuyên biệt', chứ không phải là kho lưu trữ sự thật cập nhật từng giờ. Nếu chiều nay phòng Nhân sự đổi mức phụ cấp ăn trưa từ 35.000đ lên 50.000đ, với RAG em chỉ cần cập nhật lại vài đoạn chunk trong kho dữ liệu trong 2 giây, còn Fine-tuning sẽ tốn hàng giờ huấn luyện lại và vẫn có nguy cơ mô hình nhớ nhầm số cũ (hallucination).",
          "Tuy nhiên, chất lượng của RAG phụ thuộc tới 70% vào khâu chuẩn bị dữ liệu, đặc biệt là Chunking. Nếu em cắt chunk quá nhỏ (ví dụ 50 tokens), câu trả lời sẽ mất đầu mất đuôi — đoạn văn chỉ còn câu 'Mức phạt là 15%' mà mất tiêu chủ ngữ ở câu trước nói phạt lỗi gì. Ngược lại, nếu cắt chunk quá lớn (ví dụ 4.000 tokens), một chunk chứa quá nhiều chủ đề pha trộn khiến vector đại diện bị 'loãng nghĩa', đồng thời làm tốn chi phí token và gây hiện tượng 'Lost in the Middle' (LLM hay quên thông tin nằm kẹp ở giữa đoạn văn dài)."
        ],
        bullets: [
          "Chunk Overlap (Gối đầu ngữ cảnh): Luôn giữ lại khoảng 10%–20% số token ở cuối đoạn trước lặp lại ở đầu đoạn sau để bảo toàn mạch ý nếu vết cắt vô tình rơi đúng giữa một lập luận quan trọng.",
          "Semantic / Structure-aware Chunking: Ưu tiên cắt theo cấu trúc tự nhiên của văn bản (tiêu đề Markdown H1/H2/H3, đoạn văn, hoặc giữ nguyên vẹn cả bảng biểu HTML/Markdown) thay vì đếm ký tự cơ học.",
          "Metadata Enrichment: Đính kèm tiêu đề chương, tên tài liệu gốc và ngày hiệu lực vào từng chunk để mô hình không bị nhầm quy định năm 2022 với năm 2026."
        ]
      },
      {
        heading: "2. Vector Embeddings và quy tắc sống còn về không gian chiều (Vector Space)",
        paragraphs: [
          "Làm sao máy tính hiểu được cụm từ 'nghỉ thai sản' và 'chế độ sinh con' có ý nghĩa gần giống nhau dù không trùng một chữ cái nào? Câu trả lời nằm ở mô hình Embedding. Mô hình này ánh xạ mỗi đoạn văn bản thành một điểm tọa độ trong không gian nhiều chiều (ví dụ 1.536 chiều với `text-embedding-3-small` hoặc 3.072 chiều với `text-embedding-3-large`). Trong không gian đó, những câu có cùng ý nghĩa sẽ nằm tụm lại gần nhau bất kể cách dùng từ đồng nghĩa hay thậm chí khác ngôn ngữ.",
          "Để đo xem câu hỏi của người dùng gần với đoạn tài liệu nào nhất, ta dùng phép đo Cosine Similarity — tức là đo góc lệch giữa hai mũi tên vector từ gốc tọa độ. Góc càng nhỏ (giá trị tiến sát 1.0) thì hai nội dung càng tương đồng về mặt ngữ nghĩa."
        ],
        bullets: [
          "Quy tắc bất di bất dịch trong đề thi AI-103: Lúc đánh chỉ mục tài liệu (Indexing) dùng model embedding nào (kể cả số chiều rút gọn `dimensions`), thì lúc truy vấn câu hỏi (Querying) BẮT BUỘC phải dùng chính xác model và số chiều đó.",
          "Nếu em đổi từ `text-embedding-ada-002` sang `text-embedding-3-large`, em bắt buộc phải chạy lại toàn bộ quá trình tạo vector (Re-indexing) cho kho tài liệu, tuyệt đối không thể so sánh chéo hai không gian vector khác nhau.",
          "Vector chỉ giỏi bắt 'ý nghĩa khái quát' nhưng đôi khi kém nhạy với mã sản phẩm chính xác từng ký tự (như `ERR-9042-BX`), đó là lý do ở bài B2 ta sẽ nâng cấp lên Hybrid Search."
        ]
      },
      {
        heading: "3. Grounding và Citations: Khóa miệng bệnh 'ảo giác' (Hallucination)",
        paragraphs: [
          "Lấy được đúng tài liệu rồi mới đi được nửa chặng đường; nửa còn lại là ép LLM chỉ được nói trong phạm vi bằng chứng đó — kỹ thuật này gọi là Grounding (neo bám thực tế). Bản tính tự nhiên của các mô hình ngôn ngữ lớn là luôn cố gắng chiều lòng người hỏi bằng cách dựa vào xác suất từ vựng đã học trên Internet. Nếu tài liệu nội bộ không nói về chính sách làm việc từ xa tại nước ngoài, một prompt lỏng lẻo sẽ khiến mô hình tự suy diễn ra câu trả lời nghe rất hợp lý nhưng sai hoàn toàn quy định công ty.",
          "Để xây dựng hệ thống đạt chuẩn doanh nghiệp, em phải thiết kế System Prompt đóng vai trò 'hàng rào pháp lý' kết hợp cơ chế Citations (trích dẫn nguồn). Mỗi đoạn chunk đưa vào prompt cần được bọc trong thẻ định danh rõ ràng như `[doc1]`, `[doc2]`, yêu cầu mô hình gắn nhãn nguồn ngay cuối mỗi luận điểm và trả về câu từ chối chuẩn mực khi độ tin cậy truy xuất thấp."
        ],
        bullets: [
          "Strict System Instruction: Luôn có mệnh đề rõ ràng: 'Chỉ sử dụng thông tin trong thẻ <context>. Không sử dụng kiến thức bên ngoài. Nếu không tìm thấy câu trả lời, hãy nói rõ chưa có thông tin trong tài liệu nội bộ.'",
          "Inline Citations: Yêu cầu định dạng trích dẫn chuẩn (ví dụ `[Sổ tay Nhân sự - Trang 14]`) để giao diện phía người dùng có thể bấm vào kiểm chứng ngay đoạn văn gốc.",
          "Ngưỡng điểm tương đồng (Similarity Threshold): Nếu điểm Cosine cao nhất của Top-K vẫn quá thấp (ví dụ < 0.65), ứng dụng nên chặn sớm ở tầng code hoặc báo không tìm thấy tài liệu thay vì cố gửi rác vào cho LLM đoán mò."
        ]
      }
    ],
    comparison: {
      title: "Bảng chọn kiến trúc xử lý tri thức chuẩn đề thi AI-103",
      headers: ["Phương án kỹ thuật", "Cơ chế hoạt động", "Khi nào chọn (Đề thi)", "Giới hạn / Lưu ý"],
      rows: [
        [
          "Prompt Engineering thuần túy (In-context)",
          "Nhét trực tiếp hướng dẫn và vài ví dụ mẫu (few-shot) vào cửa sổ ngữ cảnh",
          "Tác vụ chung, bộ quy tắc ngắn gọn cố định, không cần tra cứu kho tài liệu lớn",
          "Tốn token lặp đi lặp lại mỗi request, không mở rộng được cho hàng nghìn file PDF"
        ],
        [
          "RAG (Retrieval-Augmented Generation)",
          "Truy xuất động các chunk liên quan từ kho vector rồi đưa vào ngữ cảnh LLM",
          "Dữ liệu nội bộ cập nhật thường xuyên, cần trích dẫn nguồn (citations) và kiểm soát quyền truy cập",
          "Phụ thuộc lớn vào chất lượng chunking và độ chính xác của bước truy xuất"
        ],
        [
          "Fine-tuning (Tinh chỉnh mô hình)",
          "Cập nhật trọng số mô hình trên tập dữ liệu cặp câu hỏi - câu trả lời chuẩn (JSONL)",
          "Cần ép văn phong đặc thù, ngôn ngữ chuyên ngành hẹp hoặc cấu trúc JSON phức tạp nhất quán",
          "Chi phí cao, không ngăn được hallucination với dữ liệu mới phát sinh sau ngày train"
        ],
        [
          "RAG + Fine-tuning kết hợp",
          "Mô hình đã tinh chỉnh phong cách đọc dữ liệu truy xuất thời gian thực từ kho RAG",
          "Hệ thống y tế/pháp lý đòi hỏi vừa đúng thuật ngữ chuyên môn sâu vừa cập nhật hồ sơ mới nhất",
          "Độ phức tạp vận hành và đánh giá (evaluation) cao nhất"
        ]
      ]
    },
    codeTitle: "Quy trình RAG căn bản với Microsoft Foundry OpenAI SDK: Chunking, Embedding & Grounded Answer",
    code: `import os
import numpy as np
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# 1. Khởi tạo client chuẩn bảo mật Entra ID (không hardcode API Key)
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)
client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=token_provider,
    api_version="2024-10-21"
)

def chunk_text(text: str, size: int = 300, overlap: int = 50) -> list[str]:
    words = text.split()
    step = max(1, size - overlap)
    return [" ".join(words[i : i + size]) for i in range(0, len(words), step)]

# 2. Tạo vector embeddings cùng một model cho cả tài liệu và câu hỏi
docs = [
    {"id": "HR-01", "content": "Nhân viên chính thức được nghỉ phép 15 ngày/năm, cộng thêm 1 ngày mỗi 3 năm thâm niên."},
    {"id": "IT-04", "content": "Mật khẩu VPN phải dài tối thiểu 14 ký tự và đổi định kỳ mỗi 90 ngày."}
]
doc_vecs = [
    client.embeddings.create(model="text-embedding-3-small", input=d["content"]).data[0].embedding
    for d in docs
]

query = "Tôi làm việc 6 năm thì có bao nhiêu ngày phép năm?"
q_vec = client.embeddings.create(model="text-embedding-3-small", input=query).data[0].embedding

# 3. Tính Cosine Similarity và đóng gói ngữ cảnh kèm mã trích dẫn
scores = [np.dot(q_vec, dv) / (np.linalg.norm(q_vec) * np.linalg.norm(dv)) for dv in doc_vecs]
best_doc = docs[int(np.argmax(scores))]
context_block = f"[{best_doc['id']}]: {best_doc['content']}"

response = client.chat.completions.create(
    model="gpt-4o-mini",
    temperature=0.0,
    messages=[
        {"role": "system", "content": "Chỉ trả lời dựa trên ngữ cảnh được cung cấp và trích dẫn mã [ID]. Nếu không có thông tin, trả lời 'Không tìm thấy trong quy định'."},
        {"role": "user", "content": f"Ngữ cảnh:\\n{context_block}\\n\\nCâu hỏi: {query}"}
    ]
)
print(response.choices[0].message.content)`,
    codeNotes: [
      "Sử dụng `DefaultAzureCredential` kết hợp `get_bearer_token_provider` là chuẩn thực chiến và chuẩn thi AI-103 để xác thực không mật khẩu (Passwordless) với Microsoft Foundry / Azure OpenAI.",
      "Tham số `temperature=0.0` trong tác vụ RAG cực kỳ quan trọng giúp giảm tính ngẫu nhiên sáng tạo, giữ câu trả lời bám sát số liệu trong ngữ cảnh.",
      "Hàm `chunk_text` minh họa rõ cơ chế bước nhảy `size - overlap`: nếu `size=300` và `overlap=50`, cửa sổ trượt sẽ tiến từng bước 250 từ để luôn giữ lại 50 từ nối mạch."
    ],
    labGuide: {
      goal: "Xây dựng và kiểm chứng luồng RAG mini trên Python, quan sát sự khác biệt giữa câu trả lời có Grounding và khi câu hỏi nằm ngoài phạm vi tài liệu.",
      steps: [
        "Bước 1: Triển khai 2 model trong Microsoft Foundry project: `text-embedding-3-small` (tạo vector) và `gpt-4o-mini` (sinh câu trả lời), cấp quyền `Cognitive Services OpenAI User` cho tài khoản của em.",
        "Bước 2: Chuẩn bị 1 file văn bản quy chế công ty dài khoảng 3 trang (có chứa bảng mức công tác phí và quy định nghỉ phép), viết hàm cắt thành các chunk 250 từ với overlap 40 từ.",
        "Bước 3: Chạy script nhúng toàn bộ chunk, thử nghiệm hỏi một câu có thông tin nằm vắt ngang giữa 2 đoạn văn để kiểm chứng tác dụng của tham số `overlap`.",
        "Bước 4: Thử hỏi một câu hoàn toàn không có trong văn bản (ví dụ: 'Chính sách hỗ trợ mua xe hơi của công ty?') và xác nhận mô hình từ chối trả lời đúng câu mẫu thay vì tự bịa."
      ],
      expectedOutput: "Mô hình trả lời chính xác '17 ngày phép/năm (15 ngày cơ bản + 2 ngày cho 6 năm thâm niên) [HR-01]' cho câu hỏi hợp lệ, và trả về đúng thông báo 'Không tìm thấy trong quy định' cho câu hỏi ngoài phạm vi."
    },
    examTips: [
      "Từ khóa đề bài 'frequently updated documents', 'cite sources', 'reduce hallucinations without retraining' -> Chọn ngay kiến trúc RAG (tuyệt đối loại đáp án Fine-tuning).",
      "Từ khóa 'answers miss context split across paragraphs' -> Tăng `chunk overlap` hoặc chuyển sang chiến lược cắt theo cấu trúc câu/tiêu đề (sentence/markdown header splitting).",
      "Bẫy kinh điển: Đổi model embedding để tiết kiệm chi phí nhưng giữ nguyên vector index cũ -> Hệ thống sẽ trả về kết quả vô nghĩa hoặc báo lỗi lệch số chiều (dimension mismatch); bắt buộc phải Re-index."
    ],
    summaryTakeaways: [
      "RAG tách biệt 'năng lực suy luận ngôn ngữ của LLM' khỏi 'kho tri thức động của doanh nghiệp', giúp cập nhật dữ liệu tức thời và minh bạch nguồn trích dẫn.",
      "Chunking cần cân bằng giữa độ chi tiết và độ trọn vẹn ngữ cảnh, luôn kết hợp Overlap 10–20% cùng Metadata (tên file, trang, tiêu đề).",
      "Cùng một model embedding và số chiều phải được dùng đồng nhất ở cả hai pha Indexing và Querying.",
      "Grounding vững chắc đòi hỏi cả 3 chốt chặn: ngưỡng lọc điểm truy xuất, System Prompt khóa phạm vi và `temperature` thấp kèm trích dẫn `[doc_id]`."
    ],
    lessonQuestions: [
      {
        question: "Một ngân hàng xây dựng trợ lý AI giải đáp biểu phí dịch vụ thẻ tín dụng (thay đổi hàng tuần) và bắt buộc mọi câu trả lời phải đính kèm tên văn bản quyết định kèm số trang. Giải pháp nào tối ưu nhất về chi phí và độ chính xác?",
        options: [
          "Thực hiện Fine-tuning mô hình GPT-4o vào mỗi tối Chủ nhật bằng toàn bộ file PDF biểu phí mới.",
          "Áp dụng kiến trúc RAG: cắt nhỏ văn bản kèm metadata (tên quyết định, số trang), tạo vector embeddings và yêu cầu mô hình trích dẫn nguồn trong System Prompt.",
          "Tăng tham số Temperature lên 0.9 để mô hình linh hoạt suy luận ra biểu phí mới nhất.",
          "Nén toàn bộ 5.000 file PDF lịch sử của ngân hàng vào chung System Prompt trong mọi lượt gọi API."
        ],
        answer: 1,
        explanation: "Kiến trúc RAG cho phép cập nhật biểu phí hàng tuần gần như tức thời chỉ bằng cách cập nhật các đoạn chunk thay đổi, lưu trữ tên văn bản + số trang trong metadata và dùng System Prompt để buộc mô hình sinh trích dẫn chính xác mà không tốn chi phí huấn luyện lại.",
        wrongReasons: [
          "Fine-tuning hàng tuần rất tốn kém, mất thời gian và không đảm bảo mô hình trích dẫn chính xác số trang hay quên đi biểu phí cũ.",
          "",
          "Tăng Temperature lên 0.9 làm tăng mạnh tính ngẫu nhiên, khiến AI dễ bịa đặt con số lãi suất và biểu phí (hallucination).",
          "Vượt quá giới hạn cửa sổ ngữ cảnh (context window), gây độ trễ cực lớn và chi phí token khổng lồ cho mỗi câu hỏi."
        ]
      },
      {
        question: "Sau khi vận hành hệ thống RAG một thời gian, đội kỹ thuật nhận thấy khi người dùng hỏi về các điều khoản bảo hành nằm ở cuối đoạn văn thứ nhất và phần điều kiện ngoại trừ nằm ở đầu đoạn văn thứ hai, AI thường bỏ sót phần điều kiện ngoại trừ. Cách khắc phục trực tiếp và hiệu quả nhất là gì?",
        options: [
          "Giảm kích thước chunk xuống còn 20 tokens và đặt overlap bằng 0.",
          "Đổi sang mô hình sinh văn bản nhỏ hơn để chạy nhanh hơn.",
          "Cấu hình tăng độ gối đầu (chunk overlap) hợp lý kết hợp cắt văn bản theo ranh giới ngữ nghĩa/câu hoàn chỉnh.",
          "Tắt kiểm tra System Prompt để mô hình tự đoán điều kiện ngoại trừ từ kiến thức phổ thông."
        ],
        answer: 2,
        explanation: "Hiện tượng mất điều kiện đi kèm ở ranh giới hai đoạn là dấu hiệu điển hình của việc cắt chunk cơ học không có phần gối đầu. Tăng chunk overlap (ví dụ 10-15%) và cắt theo ranh giới cấu trúc giúp giữ nguyên mối liên hệ giữa điều khoản chính và ngoại lệ trong cùng một chunk.",
        wrongReasons: [
          "Chunk 20 tokens quá vụn vặt và overlap = 0 càng làm đứt gãy ngữ cảnh nghiêm trọng hơn.",
          "Đổi sang mô hình nhỏ hơn không giải quyết được việc dữ liệu đầu vào bị thiếu phần điều kiện ngoại trừ khi truy xuất.",
          "",
          "Cho phép mô hình tự đoán điều khoản bảo hành từ kiến thức bên ngoài sẽ dẫn đến rủi ro pháp lý nghiêm trọng do thông tin sai lệch."
        ]
      }
    ]
  },

  "B2": {
    duration: "55 phút",
    difficulty: "Trung cấp – Nâng cao (AI-103)",
    teacherIntro: "Chào em, ở bài B1 thầy trò mình đã tự tính Cosine Similarity trên mảng Python cho vài câu văn nhỏ. Nhưng khi bước vào dự án thật với 2 triệu tài liệu kỹ thuật, có mã linh kiện loằng ngoằng và phân quyền chặt chẽ 'nhân viên phòng nào chỉ được thấy tài liệu phòng đó', mảng Python sẽ sập ngay lập tức. Đó là lúc Azure AI Search bước ra sân khấu như bộ máy truy xuất chuẩn mực nhất hệ sinh thái Microsoft. Đi thi AI-103, thầy dám khẳng định với em rằng các từ khóa Hybrid Search, RRF, Semantic Ranker và Security Trimming gần như chắc chắn xuất hiện trong đề!",
    analogy: {
      title: "Hội đồng hai vị giám khảo và anh bảo vệ gác cửa kho hồ sơ",
      body: "Em hãy hình dung việc tìm tài liệu trong Azure AI Search giống như nhờ hai chuyên gia cùng lục kho sách: Chuyên gia Từ khóa (BM25) soi cực chuẩn từng mã số hợp đồng, số hiệu linh kiện `AX-990`; còn Chuyên gia Ngữ nghĩa (Vector) hiểu được ý tứ sâu xa dù khách hỏi bằng từ đồng nghĩa. Sau khi hai người lập danh sách ứng viên riêng, Tổ trưởng RRF sẽ gộp điểm công bằng của cả hai lại thành Top 50, rồi chuyển cho Giáo sư thẩm định (Semantic Ranker) đọc kỹ từng cặp câu hỏi – đoạn văn để chọn ra Top 5 xuất sắc nhất. Và đặc biệt, ngay từ cửa kho đã có anh bảo vệ (Security Trimming Filter) kiểm tra thẻ nhân viên: tài liệu nào em không có quyền đọc thì bị loại ngay từ vòng gửi xe!"
    },
    objectives: [
      "Thiết kế được Index Schema chuẩn trong Azure AI Search với đầy đủ các thuộc tính trường (`searchable`, `filterable`, `facetable`, `retrievable`, vector HNSW).",
      "Giải thích rõ luồng hoạt động của Hybrid Search (Keyword BM25 + Vector), thuật toán trộn hạng RRF và tầng tái xếp hạng Semantic Ranker.",
      "Triển khai được cơ chế lọc phân quyền tài liệu cấp độ dòng (Document-level Security Trimming) bằng biểu thức OData filter."
    ],
    flow: [
      {
        step: "1. Security Pre-filtering (Lọc quyền truy cập trước)",
        detail: "Ứng dụng lấy danh sách Group ID / User ID từ token Entra ID của người dùng và gắn vào biểu thức `$filter` để loại bỏ mọi tài liệu trái thẩm quyền."
      },
      {
        step: "2. Parallel Dual Retrieval (Truy vấn kép song song)",
        detail: "Azure AI Search chạy đồng thời tìm kiếm từ khóa toàn văn (BM25 trên inverted index) và tìm kiếm vector gần đúng (HNSW trên trường `Collection(Edm.Single)`)."
      },
      {
        step: "3. Reciprocal Rank Fusion - RRF (Hợp nhất thứ hạng)",
        detail: "Thuật toán RRF kết hợp thứ hạng từ hai luồng BM25 và Vector thành một bảng xếp hạng thống nhất mà không bị lệch do thang đo điểm số khác nhau."
      },
      {
        step: "4. Semantic Reranking & Extractive Captions (Tái xếp hạng ngữ nghĩa sâu)",
        detail: "Mô hình ngôn ngữ chuyên dụng L2 (Semantic Ranker) chấm điểm lại Top 50 kết quả theo mức độ trả lời trực tiếp câu hỏi (thang điểm `@search.reranker_score` 0–4) và trích xuất câu tóm tắt nổi bật."
      }
    ],
    sections: [
      {
        heading: "1. Thiết kế Index Schema: Chọn sai một thuộc tính là phải xây lại Index!",
        paragraphs: [
          "Trong Azure AI Search, Index Schema giống như bản vẽ kết cấu móng nhà của một bảng cơ sở dữ liệu chuyên cho tìm kiếm. Mỗi trường (field) không chỉ có kiểu dữ liệu (`Edm.String`, `Collection(Edm.String)`, `Collection(Edm.Single)` cho vector) mà còn gắn các cờ thuộc tính quyết định cách hệ thống đánh chỉ mục vào RAM và ổ cứng. Điểm mấu chốt thầy muốn em nhớ khi đi thi: không phải cứ bật hết mọi cờ lên là tốt, vì bật thừa `searchable` hay `facetable` sẽ làm phình kích thước index và tốn chi phí SKU đáng kể.",
          "Đặc biệt, với trường lưu trữ Vector (ví dụ `content_vector`), em phải khai báo kiểu `Collection(Edm.Single)`, bật `searchable=True`, gán đúng `vector_search_dimensions` khớp với model embedding (như 1536) và gắn cấu hình thuật toán HNSW (Hierarchical Navigable Small World) để tìm láng giềng gần nhất với tốc độ mili-giây trên hàng triệu bản ghi."
        ],
        bullets: [
          "`searchable`: Cho phép tách từ (tokenization/analyzer) để tìm toàn văn BM25 (dùng cho `title`, `chunk_content`). Không bật cho trường ID hay mã phân quyền.",
          "`filterable`: Cho phép lọc chính xác đúng/sai trong mệnh đề `$filter` (bắt buộc bật cho `department`, `allowed_groups`, `created_date`). Khớp chính xác không qua bộ tách từ.",
          "`facetable`: Dùng để đếm số lượng theo nhóm làm bộ lọc thanh bên giao diện (ví dụ: Thương hiệu (120), Năm xuất bản (45)).",
          "`retrievable` (trong SDK đôi khi hiển thị qua `hidden=False`): Cho phép trả nội dung trường đó về JSON kết quả. Thực chiến thường ẩn (`hidden=True`) trường mảng số `content_vector` lúc trả kết quả để tiết kiệm băng thông mạng."
        ]
      },
      {
        heading: "2. Sức mạnh của Hybrid Search + RRF + Semantic Ranker",
        paragraphs: [
          "Tại sao chỉ dùng Vector Search thôi lại chưa đủ cho doanh nghiệp? Giả sử kỹ sư bảo trì gõ vào khung chat mã lỗi máy biến áp `'E-7741-LV'`. Vector Search có xu hướng quy về nghĩa chung là 'lỗi thiết bị điện hạ thế', nên có thể xếp tài liệu của mã `'E-7742-LV'` lên trên cả mã chính xác! Ngược lại, nếu chỉ dùng Keyword Search (BM25) truyền thống, khi khách hàng hỏi `'làm sao hủy gói cước gia hạn tự động'`, hệ thống lại bỏ sót bài hướng dẫn có tiêu đề `'chấm dứt chu kỳ thanh toán định kỳ'` vì không trùng từ khóa.",
          "Khi em kết hợp cả hai thành **Hybrid Search**, Azure AI Search dùng thuật toán **RRF (Reciprocal Rank Fusion)** tính điểm dựa trên vị trí xếp hạng `1 / (k + rank_i)`. Tài liệu nào vừa trúng từ khóa chính xác vừa trúng ý nghĩa ngữ cảnh sẽ vọt lên đầu bảng. Chưa dừng lại ở đó, khi bật thêm **Semantic Ranker**, một mô hình đọc hiểu chéo (Cross-encoder) sẽ đọc song song câu hỏi và từng ứng viên trong Top 50 từ bước RRF để đánh giá xem đoạn văn đó *có thực sự chứa câu trả lời hay chỉ tình cờ lặp lại từ khóa*, trả về điểm `@search.reranker_score` từ 0.0 đến 4.0 cực kỳ đáng tin cậy cho RAG."
        ],
        bullets: [
          "Công thức vàng cho độ chính xác RAG tối đa trong đề thi AI-103: **Hybrid Search (Keyword + Vector) + Semantic Ranker**.",
          "RRF tự động chạy ngầm mỗi khi một request chứa đồng thời `search_text` (từ khóa) và `vector_queries` (truy vấn vector), em không cần tự viết code cộng điểm thủ công.",
          "Semantic Ranker còn tặng kèm tính năng **Semantic Captions** (trích đoạn tiêu biểu nhất) và **Semantic Answers** giúp đưa những câu đắt giá nhất vào prompt của LLM, tiết kiệm token đầu vào."
        ]
      },
      {
        heading: "3. Security Trimming: Chốt chặn bảo mật sống còn cho RAG nội bộ",
        paragraphs: [
          "Em hãy tưởng tượng tai họa gì sẽ xảy ra nếu nhân viên thực tập hỏi chatbot công ty: `'Mức lương thưởng năm nay của Giám đốc Tài chính là bao nhiêu?'` và hệ thống RAG ngoan ngoãn lục được file bảng lương Excel trên SharePoint rồi trả lời vanh vách! LLM hoàn toàn mù về quyền hạn người dùng — hễ ngữ cảnh được nhét vào prompt là nó đọc và trả lời. Vì vậy, phân quyền trong RAG bắt buộc phải thực hiện ở **tầng truy xuất của Azure AI Search** trước khi dữ liệu chạm tới LLM.",
          "Kỹ thuật phổ biến và chuẩn bài bản nhất gọi là **Document-level Security Trimming dùng bộ lọc OData**. Khi nạp tài liệu vào Index, ta lưu thêm một trường `allowed_groups` kiểu `Collection(Edm.String)` chứa danh sách Object ID các nhóm Entra ID được phép đọc file đó. Lúc người dùng đăng nhập và đặt câu hỏi, backend đọc danh sách nhóm của họ từ Access Token và truyền vào tham số `filter=\"allowed_groups/any(g: search.in(g, 'groupA,groupB', ','))\"`."
        ],
        bullets: [
          "Không bao giờ lọc quyền bằng System Prompt (ví dụ dặn LLM 'Đừng tiết lộ lương nếu người hỏi là thực tập sinh') vì cực kỳ dễ bị vượt qua bằng Prompt Injection.",
          "Trường dùng cho Security Trimming bắt buộc phải khai báo `filterable=True` trong Index Schema.",
          "Ngoài lọc thủ công bằng `search.in()`, Azure AI Search hiện còn hỗ trợ tích hợp quyền gốc (Purview / Entra token-based access control) ở một số kịch bản nâng cao, nhưng mô hình ACL + OData `$filter` vẫn là kiến thức nền tảng cốt lõi nhất trong đề thi."
        ]
      }
    ],
    comparison: {
      title: "So sánh các chế độ truy vấn trong Azure AI Search (Chuẩn đề thi AI-103)",
      headers: ["Chế độ tìm kiếm", "Cơ chế hoạt động", "Khi nào chọn (Đề thi)", "Giới hạn / Lưu ý"],
      rows: [
        [
          "Keyword Search (BM25)",
          "Đối khớp từ vựng trên chỉ mục đảo (Inverted Index) có phân tích từ gốc",
          "Tìm chính xác mã SKU, số hợp đồng, tên riêng, thuật ngữ viết tắt cố định",
          "Thất bại khi người dùng diễn đạt khác từ vựng (từ đồng nghĩa) hoặc hỏi đa ngôn ngữ"
        ],
        [
          "Pure Vector Search (HNSW)",
          "So khớp khoảng cách góc trong không gian vector nhiều chiều",
          "Tìm kiếm ý niệm tương đồng, đa ngôn ngữ, hoặc tìm ảnh/âm thanh đa phương thức",
          "Dễ nhầm lẫn các mã định danh gần giống nhau (ví dụ `ISO-9001` vs `ISO-9004`) hoặc số liệu cụ thể"
        ],
        [
          "Hybrid Search (BM25 + Vector + RRF)",
          "Chạy song song Keyword và Vector, hợp nhất thứ hạng bằng Reciprocal Rank Fusion",
          "Mặc định khuyên dùng cho mọi hệ thống tìm kiếm tài liệu doanh nghiệp tổng hợp",
          "Chưa đánh giá sâu quan hệ cú pháp trực tiếp giữa câu hỏi dài và đoạn văn ứng viên"
        ],
        [
          "Hybrid + Semantic Ranker",
          "Áp dụng mô hình đọc hiểu L2 tái xếp hạng Top 50 kết quả từ bước Hybrid RRF",
          "Hệ thống RAG cần chất lượng ngữ cảnh đầu vào cao nhất để giảm thiểu hallucination",
          "Yêu cầu bậc dịch vụ Basic trở lên (không hỗ trợ ở Free tier cho khối lượng lớn) và cộng thêm vài chục ms độ trễ"
        ]
      ]
    },
    codeTitle: "Truy vấn Hybrid Search + Semantic Ranker + Security Trimming trong Azure AI Search",
    code: `import os
from azure.identity import DefaultAzureCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery, QueryType

# 1. Kết nối tới Index bằng Entra ID (RBAC role: Search Index Data Reader)
search_client = SearchClient(
    endpoint=os.environ["AZURE_SEARCH_ENDPOINT"],
    index_name="enterprise-policies-idx",
    credential=DefaultAzureCredential()
)

user_query = "Quy định bồi hoàn chi phí vé máy bay hạng thương gia mã CB-2026"
# Danh sách Entra Group Object IDs trích xuất từ JWT token của người đang đăng nhập
user_group_ids = "7a12f-hr-group,9b88c-all-staff"
security_filter = f"allowed_groups/any(g: search.in(g, '{user_group_ids}', ','))"

# 2. Sử dụng integrated vectorizer để Search tự nhúng câu hỏi thành vector
vector_query = VectorizableTextQuery(
    text=user_query,
    k_nearest_neighbors=50,
    fields="content_vector"
)

# 3. Thực thi Hybrid Search + RRF + Semantic Ranker + Security Trimming
results = search_client.search(
    search_text=user_query,                  # Luồng Keyword BM25
    vector_queries=[vector_query],           # Luồng Vector HNSW -> tự động kích hoạt RRF
    filter=security_filter,                  # Lọc quyền truy cập trước khi trả kết quả
    query_type=QueryType.SEMANTIC,           # Kích hoạt Semantic Ranker L2
    semantic_configuration_name="default-semantic-config",
    select=["doc_id", "title", "chunk_text"],
    top=5
)

for item in results:
    print(f"[{item['doc_id']}] Reranker Score: {item['@search.reranker_score']:.2f} | {item['title']}")`,
    codeNotes: [
      "`VectorizableTextQuery` tận dụng tính năng **Integrated Vectorization** của Azure AI Search: em chỉ cần truyền chuỗi `text`, dịch vụ tự gọi sang model embedding đã cấu hình sẵn để lấy vector mà không tốn thêm 1 vòng gọi mạng từ app.",
      "Truyền `k_nearest_neighbors=50` ở bước vector để gom đủ tập ứng viên rộng cho RRF và Semantic Ranker sàng lọc lại còn `top=5` đoạn tinh túy nhất đưa vào LLM.",
      "Hàm `search.in(...)` trong biểu thức OData được tối ưu hóa hiệu năng cao hơn rất nhiều so với việc nối hàng chục phép `or` thủ công khi người dùng thuộc nhiều phòng ban."
    ],
    labGuide: {
      goal: "Tạo Index tích hợp Hybrid + Semantic Ranker trên Azure AI Search và kiểm chứng bộ lọc phân quyền Security Trimming hoạt động chính xác.",
      steps: [
        "Bước 1: Tạo dịch vụ Azure AI Search (tier Basic trở lên), bật System-assigned Managed Identity và cấp quyền `Cognitive Services OpenAI User` để Search gọi được model embedding trên Foundry.",
        "Bước 2: Định nghĩa Index gồm các trường `doc_id` (key), `title` (searchable), `chunk_text` (searchable), `allowed_groups` (`Collection(Edm.String)`, filterable=True) và `content_vector` (1536 chiều, HNSW) kèm một `SemanticConfiguration`.",
        "Bước 3: Nạp 4 tài liệu mẫu, trong đó có 1 tài liệu 'Bảng lương Ban Giám Đốc' chỉ gán `allowed_groups: ['vip-board']`, còn 3 tài liệu quy chế chung gán `['all-staff']`.",
        "Bước 4: Chạy script truy vấn với `user_group_ids = 'all-staff'` hỏi về lương Ban Giám Đốc để kiểm chứng tài liệu nhạy cảm bị chặn tuyệt đối (0 kết quả rò rỉ), sau đó thử hỏi câu chứa cả mã quy chế lẫn từ đồng nghĩa để so sánh điểm `@search.reranker_score`."
      ],
      expectedOutput: "Truy vấn của nhân viên thường tuyệt đối không nhìn thấy tài liệu của nhóm `vip-board`; các truy vấn hợp lệ trả về Top 5 đoạn văn có `@search.reranker_score` sắp xếp giảm dần (thang 0.00 - 4.00)."
    },
    examTips: [
      "Đề bài nêu kịch bản: 'Users search by both exact product part numbers (e.g., XJ-402) and natural language symptom descriptions, needing maximum RAG accuracy' -> Chọn **Hybrid Search with Semantic Ranker**.",
      "Đề bài hỏi thuật toán nào Azure AI Search dùng để gộp kết quả từ Keyword search và Vector search -> Chọn **Reciprocal Rank Fusion (RRF)**.",
      "Bẫy thường gặp: Đề hỏi muốn lọc theo trường `department` bằng mệnh đề `$filter` nhưng báo lỗi -> Kiểm tra xem trường đó đã bật `filterable: true` chưa (lưu ý: để sửa thuộc tính trường đã tạo, thường phải tạo lại Index và nạp lại dữ liệu)."
    ],
    summaryTakeaways: [
      "Hybrid Search kết hợp độ chuẩn xác ký tự của BM25 và độ sâu ngữ nghĩa của Vector HNSW thông qua thuật toán hợp nhất hạng RRF.",
      "Semantic Ranker đọc hiểu chéo Top 50 kết quả để tái xếp hạng theo thang điểm 0–4, giúp lọc nhiễu cực tốt trước khi nạp ngữ cảnh cho LLM.",
      "Cờ thuộc tính trường phải phân biệt rạch ròi: `searchable` cho tìm toàn văn, `filterable` cho lọc điều kiện `$filter`, `facetable` cho đếm nhóm thống kê.",
      "Bảo mật dữ liệu RAG phải thực thi bằng Security Trimming ngay tại tầng truy vấn Azure AI Search dựa trên danh tính Entra ID, tuyệt đối không phó mặc cho System Prompt."
    ],
    lessonQuestions: [
      {
        question: "Công ty dược phẩm của bạn xây dựng hệ thống tra cứu tài liệu lâm sàng trên Azure AI Search phục vụ RAG. Bác sĩ vừa tìm theo mã hoạt chất chính xác (như 'MK-3475-09'), vừa mô tả triệu chứng lâm sàng dài bằng ngôn ngữ tự nhiên. Bạn cần cấu hình truy vấn nào để đạt độ liên quan cao nhất cho đoạn văn đưa vào LLM?",
        options: [
          "Chỉ sử dụng Pure Vector Search với thuật toán Exhaustive KNN.",
          "Chỉ sử dụng Keyword Search với bộ phân tích Lucene tiêu chuẩn.",
          "Kết hợp Hybrid Search (Keyword + Vector hợp nhất qua RRF) và bật thêm Semantic Ranker.",
          "Tắt tìm kiếm từ khóa và tăng kích thước chunk lên 8.000 tokens."
        ],
        answer: 2,
        explanation: "Hybrid Search đảm bảo bắt trúng cả mã hoạt chất chính xác (nhờ BM25) lẫn mô tả triệu chứng tự nhiên (nhờ Vector), sau đó RRF gộp hạng và Semantic Ranker chấm điểm lại mức độ liên quan ngữ nghĩa sâu để chọn ra các đoạn chất lượng nhất cho LLM.",
        wrongReasons: [
          "Pure Vector Search dễ xếp nhầm các mã hoạt chất có ký tự gần giống nhau.",
          "Keyword Search thuần túy sẽ bỏ lỡ các tài liệu dùng thuật ngữ y khoa đồng nghĩa khác cách diễn đạt của bác sĩ.",
          "",
          "Tắt từ khóa làm mất khả năng khớp mã chính xác và chunk 8.000 tokens gây nhiễu nặng cho ngữ cảnh RAG."
        ]
      },
      {
        question: "Bạn cần đảm bảo khi nhân viên kinh doanh khu vực Miền Nam hỏi trợ lý AI, hệ thống RAG chỉ được phép lấy thông tin từ các hợp đồng thuộc khu vực Miền Nam hoặc tài liệu công khai toàn công ty. Cách thiết kế nào tuân thủ đúng chuẩn bảo mật trên Azure AI Search?",
        options: [
          "Đưa toàn bộ hợp đồng mọi miền vào prompt rồi dặn GPT-4o trong System Prompt: 'Không tiết lộ hợp đồng Miền Bắc cho người Miền Nam'.",
          "Thêm trường `allowed_regions` có thuộc tính `filterable=True` vào Index và truyền biểu thức OData `$filter` dựa trên thông tin định danh từ token Entra ID của người dùng trong mỗi truy vấn.",
          "Bật thuộc tính `sortable=True` cho trường nội dung hợp đồng để đẩy hợp đồng Miền Nam lên đầu.",
          "Giảm tham số `top` xuống bằng 1 để người dùng ít có cơ hội nhìn thấy hợp đồng miền khác."
        ],
        answer: 1,
        explanation: "Security Trimming ở cấp độ tài liệu thông qua trường `filterable` kết hợp biểu thức OData `$filter` xác thực từ token của người dùng sẽ loại bỏ triệt để mọi hợp đồng không thuộc quyền hạn trước khi kết quả được gửi sang LLM.",
        wrongReasons: [
          "Dặn dò trong System Prompt không phải là biện pháp bảo mật và rất dễ bị khai thác qua Prompt Injection.",
          "",
          "Thuộc tính `sortable` chỉ sắp xếp thứ tự chứ không hề chặn dữ liệu trái phép xuất hiện trong kết quả.",
          "Giảm `top=1` vẫn trả về hợp đồng Miền Bắc nếu câu hỏi của người dùng cố tình nhắm vào khách hàng Miền Bắc."
        ]
      }
    ]
  },

  "B3": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, ở hai bài trước AI của chúng ta đã biết đọc tài liệu cực giỏi, nhưng suy cho cùng nó vẫn chỉ là một 'cố vấn ngồi bàn giấy' — biết trả lời chính sách đổi trả hàng chứ chưa thể tự tay tra mã vận đơn thời gian thực hay tạo phiếu hoàn tiền trên hệ thống ERP. Để nâng cấp một Chatbot hỏi đáp thành một AI Agent thực thụ có 'đôi tay' tương tác với thế giới bên ngoài, chúng ta phải trang bị cho nó **Agent Tools**. Trong kỳ thi AI-103, Microsoft kiểm tra rất kỹ cách em định nghĩa đặc tả OpenAPI / Function Calling, cách viết mô tả schema để AI không gọi nhầm hàm, và đặc biệt là nguyên tắc bảo mật tối thiểu (Least Privilege) khi cho AI chạm vào API thật.",
    analogy: {
      title: "Giám đốc điều hành và cuốn danh bạ nội bộ các phòng ban",
      body: "Em hãy hình dung mô hình LLM trong một Agent giống như vị Giám đốc trực tổng đài ngồi trong phòng kín: ông ấy cực giỏi phân tích yêu cầu của khách nhưng không trực tiếp giữ chìa khóa kho hàng. Trên bàn ông ấy có một cuốn sổ danh bạ ghi rõ: 'Muốn tra tồn kho -> gọi máy lẻ 101 kèm mã SKU; Muốn kiểm tra thời tiết giao hàng -> gọi máy lẻ 102 kèm tên thành phố' (đó chính là Tool Definitions / JSON Schema). Lưu ý cực kỳ quan trọng: ông Giám đốc KHÔNG tự chạy xuống kho đếm hàng, ông ấy chỉ viết tờ phiếu yêu cầu gọi máy lẻ nào với tham số gì, còn hệ thống ứng dụng của em mới là người thực sự nhấc máy gọi API rồi mang kết quả quay lại cho ông ấy tổng hợp câu trả lời!"
    },
    objectives: [
      "Hiểu rõ cơ chế thực thi 2 nhịp của Tool/Function Calling và lựa chọn đúng loại công cụ (Custom Python Function, OpenAPI 3.0 Spec, Azure AI Search/Code Interpreter tích hợp sẵn).",
      "Thiết kế được JSON Schema chặt chẽ (`strict: true`), viết `description` giàu ngữ nghĩa để ngăn chặn lỗi AI đoán mò tham số.",
      "Xử lý ngoại lệ an toàn (timeout, retry, graceful fallback) và áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege) cho mọi công cụ của Agent."
    ],
    flow: [
      {
        step: "1. Tool Discovery & Intent Matching (Nhận diện công cụ cần dùng)",
        detail: "Ứng dụng gửi câu hỏi người dùng kèm danh sách đặc tả công cụ (tên hàm, mô tả, JSON Schema các tham số) tới Agent / LLM."
      },
      {
        step: "2. Structured Tool Call Emission (Sinh lệnh gọi có cấu trúc)",
        detail: "Nếu cần dữ liệu bên ngoài, mô hình không trả lời văn bản ngay mà trả về đối tượng `tool_calls` chứa tên hàm và chuỗi JSON đối số tuân thủ nghiêm ngặt schema."
      },
      {
        step: "3. Sandboxed Execution & Error Handling (Thực thi an toàn ở tầng App/Service)",
        detail: "Môi trường runtime kiểm tra quyền hạn, gọi hàm Python hoặc REST API thực tế với cơ chế giới hạn thời gian (`timeout`), bắt lỗi và định dạng kết quả trả về."
      },
      {
        step: "4. Observation Synthesis (Tổng hợp câu trả lời cuối)",
        detail: "Kết quả thực thi công cụ (dạng message role `tool`) được gửi ngược lại cho mô hình để diễn giải thành câu trả lời tự nhiên hoặc quyết định gọi tiếp công cụ thứ hai."
      }
    ],
    sections: [
      {
        heading: "1. Các loại Agent Tools trong Microsoft Foundry và cách chọn chuẩn đề thi",
        paragraphs: [
          "Khi làm việc với Microsoft Foundry Agent Service (hoặc Azure OpenAI Responses / Chat Completions API), em không cần phải viết lại từ đầu mọi thứ bằng Python thuần. Nền tảng cung cấp sẵn một hệ sinh thái công cụ phong phú, và đề thi AI-103 rất thích đặt tình huống: 'Đội phát triển đã có sẵn 15 REST microservices viết bằng .NET có tài liệu Swagger, làm sao tích hợp vào Agent nhanh nhất mà ít phải viết code kết nối nhất?'. Câu trả lời ăn điểm ngay lập tức chính là **OpenAPI 3.0 Specified Tool**!",
          "Với OpenAPI Tool, dịch vụ Agent đọc trực tiếp file đặc tả JSON/YAML của API và tự động thực hiện lời gọi HTTP phía server thông qua kết nối xác thực Managed Identity hoặc API Key lưu an toàn, em không cần tự viết vòng lặp bắt `tool_calls` ở client. Ngược lại, nếu em cần chạy logic nghiệp vụ nội bộ ngay trong ứng dụng Python của mình hoặc cần kiểm soát từng bước tiền xử lý dữ liệu trước khi gọi hàm, **Custom Function Calling** lại là lựa chọn linh hoạt nhất."
        ],
        bullets: [
          "**OpenAPI 3.0 Tool**: Tích hợp trực tiếp các REST API doanh nghiệp có sẵn đặc tả chuẩn OpenAPI (nhớ khai báo rõ `operationId`, `summary`, `description` và `servers` URL đầy đủ).",
          "**Custom Python Function Tool**: Mô hình chỉ sinh tên hàm + JSON arguments; code Python phía ứng dụng tự thực thi và gửi kết quả lại — kiểm soát tối đa logic nội bộ.",
          "**Built-in Tools (Code Interpreter, File Search / Azure AI Search, MCP)**: Dùng ngay hộp cát Python vẽ biểu đồ/tính toán số liệu chính xác (`Code Interpreter`) hoặc kết nối máy chủ công cụ chuẩn hóa qua giao thức Model Context Protocol (`MCP`)."
        ]
      },
      {
        heading: "2. Strict Schema & Nghệ thuật viết Description: 'Prompt ngầm' cho đôi tay Agent",
        paragraphs: [
          "Một sai lầm phổ biến nhất của lập trình viên khi mới viết Agent là đặt tên hàm cộc lốc kiểu `proc_data(a, b)` mà không viết mô tả chi tiết. Em phải nhớ rằng đối với LLM, phần `description` của hàm và của từng thuộc tính tham số chính là **System Prompt hướng dẫn khi nào được bấm nút và điền giá trị định dạng gì**. Nếu em có hai hàm `get_order_status` và `get_shipment_tracking`, mà mô tả mập mờ, Agent sẽ gọi nhầm liên tục!",
          "Hơn nữa, để chấm dứt tình trạng mô hình trả về JSON thiếu trường bắt buộc hoặc truyền sai kiểu dữ liệu (ví dụ schema cần số nguyên `int` lại truyền chuỗi `'mười lăm'`), em cần bật chế độ **Structured Outputs cho Function Calling (`strict: true`)**. Khi bật `strict: true` kèm `additionalProperties: false` và liệt kê đủ mảng `required`, bộ giải mã của mô hình bị ép ở mức token (constrained decoding) phải sinh ra JSON khớp 100% với bản thiết kế."
        ],
        bullets: [
          "Viết rõ định dạng và ví dụ ngay trong mô tả tham số: ví dụ `'Ngày bắt đầu tra cứu theo chuẩn ISO-8601 YYYY-MM-DD, không dùng từ tương đối như hôm qua'`.",
          "Sử dụng `enum` cho các tham số có tập giá trị cố định (ví dụ `currency: ['VND', 'USD', 'JPY']`) để triệt tiêu hoàn toàn khả năng mô hình tự chế mã tiền tệ lạ.",
          "Không nhồi nhét hàng trăm công cụ vào cùng một Agent đơn lẻ: khi số lượng công cụ vượt quá ~15–20 hàm, độ chính xác chọn hàm của LLM giảm sút rõ rệt và tốn rất nhiều token đầu vào."
        ]
      },
      {
        heading: "3. Xử lý lỗi thực chiến (Timeout/Fallback) và Bảo mật Least Privilege",
        paragraphs: [
          "Trong môi trường thực tế, API bên thứ ba có thể bị treo 30 giây, trả về lỗi `503 Service Unavailable`, hoặc khách hàng cố tình nhập mã đơn hàng sai. Nếu hàm tool của em ném thẳng một exception chưa bắt làm văng cả tiến trình Python, người dùng sẽ nhận màn hình trắng báo lỗi hệ thống. Kỹ thuật đúng đắn là luôn bọc lời gọi API bên ngoài bằng `timeout` chặt chẽ (ví dụ 5–8 giây), áp dụng thử lại có giãn cách (`exponential backoff`) với các lỗi mạng tạm thời (429/503), và nếu vẫn thất bại thì **trả về một chuỗi JSON mô tả lỗi thân thiện vào lại message `tool`** để LLM thông báo khéo léo cho khách và đề xuất phương án dự phòng (graceful fallback).",
          "Về mặt an toàn bảo mật — phần cực kỳ trọng tâm trong cả AI-103 lẫn AI-500 — em tuyệt đối phải tuân thủ nguyên tắc **Least Privilege (Đặc quyền tối thiểu)**. Nếu Agent chỉ có nhiệm vụ tra cứu trạng thái đơn hàng cho khách vãng lai, kết nối cơ sở dữ liệu hoặc Managed Identity cấp cho tool đó CHỈ ĐƯỢC PHÉP có quyền `SELECT` trên view đơn hàng, tuyệt đối không dùng chung chuỗi kết nối quyền `db_owner` có thể `DROP` hoặc `UPDATE` bảng!"
        ],
        bullets: [
          "Luôn xác thực lại danh tính người dùng ở phía hàm thực thi (ví dụ lấy `user_id` từ phiên đăng nhập phía server chứ KHÔNG tin tưởng `user_id` do LLM tự điền vào tham số hàm!).",
          "Áp dụng `timeout` bắt buộc trên mọi HTTP request trong tool để tránh treo luồng hội thoại của Agent.",
          "Với các hành động có tác động ghi/xóa/chuyển tiền (destructive/state-changing actions), không cho phép thực thi tự động hoàn toàn mà phải kết hợp xác nhận con người (sẽ học sâu ở bài B5)."
        ]
      }
    ],
    comparison: {
      title: "Bảng lựa chọn cơ chế tích hợp công cụ cho Agent (Chuẩn đề thi AI-103)",
      headers: ["Loại công cụ (Tool)", "Cơ chế hoạt động", "Khi nào chọn (Đề thi)", "Giới hạn / Lưu ý"],
      rows: [
        [
          "Custom Function Calling",
          "LLM trả về JSON `tool_calls`, ứng dụng của bạn tự chạy code và gửi kết quả lại",
          "Cần chạy logic nội bộ phức tạp, kiểm tra dữ liệu tùy chỉnh hoặc gọi SDK nội bộ ngay trong app",
          "Lập trình viên phải tự quản lý vòng lặp gọi hàm và xử lý ngoại lệ phía client"
        ],
        [
          "OpenAPI 3.0 Tool",
          "Foundry Agent Service đọc file spec OpenAPI và tự gọi REST endpoint phía server",
          "Tái sử dụng nhanh các microservices / Azure Functions / Logic Apps đã có sẵn tài liệu OpenAPI",
          "Spec phải khai báo chuẩn `operationId`, mô tả rõ ràng và cấu hình xác thực hợp lệ"
        ],
        [
          "Code Interpreter (Built-in)",
          "Agent tự viết và chạy code Python trong môi trường hộp cát (sandbox) cô lập",
          "Tính toán tài chính chính xác, phân tích file CSV/Excel tải lên, vẽ biểu đồ trực quan",
          "Không truy cập trực tiếp Internet tự do để gọi hệ thống nội bộ nếu không truyền dữ liệu vào"
        ],
        [
          "MCP Server Tool",
          "Kết nối tới máy chủ cung cấp công cụ theo chuẩn mở Model Context Protocol",
          "Dùng chung bộ công cụ chuẩn hóa giữa nhiều nền tảng Agent khác nhau trong doanh nghiệp",
          "Cần kiểm soát chặt danh sách máy chủ MCP tin cậy (allowlist) và phân quyền token"
        ]
      ]
    },
    codeTitle: "Function Calling với Strict JSON Schema, Timeout và Graceful Fallback an toàn",
    code: `import json, os, httpx
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=get_bearer_token_provider(
        DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
    ),
    api_version="2024-10-21"
)

# 1. Định nghĩa công cụ với Strict Schema khóa chặt kiểu dữ liệu
tools = [{
    "type": "function",
    "function": {
        "name": "get_order_status",
        "description": "Tra cứu trạng thái vận chuyển đơn hàng theo mã đơn chuẩn ORD-xxxxx.",
        "strict": True,
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string", "description": "Mã đơn hàng bắt đầu bằng ORD-, ví dụ ORD-88210"},
                "currency": {"type": "string", "enum": ["VND", "USD"]}
            },
            "required": ["order_id", "currency"],
            "additionalProperties": False
        }
    }
}]

# 2. Hàm thực thi có Timeout 5 giây, Least Privilege (chỉ đọc) & lấy user_id từ session server
def execute_get_order_status(authenticated_user_id: str, order_id: str, currency: str) -> str:
    try:
        with httpx.Client(timeout=5.0) as http:
            resp = http.get(
                f"https://api.internal.contoso.com/readonly/orders/{order_id}",
                headers={"X-Caller-User": authenticated_user_id},
                params={"currency": currency}
            )
            resp.raise_for_status()
            return resp.text
    except httpx.TimeoutException:
        return json.dumps({"status": "degraded", "error": "Hệ thống vận đơn phản hồi chậm quá 5s. Vui lòng thử lại sau."})
    except httpx.HTTPStatusError as exc:
        return json.dumps({"status": "error", "code": exc.response.status_code, "message": "Không tìm thấy đơn hoặc không thuộc quyền sở hữu."})`,
    codeNotes: [
      "Khi bật `\"strict\": True`, bắt buộc phải đi kèm `\"additionalProperties\": False` và khai báo toàn bộ thuộc tính trong mảng `\"required\"` theo đúng chuẩn Structured Outputs.",
      "Quan sát tham số `authenticated_user_id`: giá trị này được tầng backend truyền trực tiếp từ session đã đăng nhập vào hàm thực thi chứ KHÔNG để trong JSON Schema cho LLM tự sinh — đây là chốt chặn chống tấn công giả mạo tham số xem trộm đơn người khác (IDOR).",
      "Khi gặp `TimeoutException`, hàm không làm sập ứng dụng mà trả về chuỗi JSON mô tả trạng thái `degraded`, giúp LLM có thể xin lỗi khách hàng lịch sự và hướng dẫn họ để lại thông tin."
    ],
    labGuide: {
      goal: "Xây dựng Agent tra cứu đơn hàng có khả năng gọi hàm chuẩn Strict Schema và tự động chuyển sang thông báo dự phòng êm ái khi API bị quá thời gian chờ.",
      steps: [
        "Bước 1: Khai báo tool `get_order_status` với `strict: True` như đoạn code mẫu và tạo một hàm giả lập API: nếu `order_id == 'ORD-SLOW'` thì `time.sleep(8)` để giả lập nghẽn mạng, nếu `order_id == 'ORD-10001'` thì trả về JSON giao hàng thành công.",
        "Bước 2: Viết vòng lặp xử lý `response.choices[0].message.tool_calls`: trích xuất `arguments` bằng `json.loads`, gọi hàm thực thi kèm `authenticated_user_id` của phiên làm việc và đẩy message `role='tool'` (kèm `tool_call_id` khớp chính xác) vào mảng hội thoại.",
        "Bước 3: Thử hỏi câu 'Kiểm tra giúp tôi đơn hàng ORD-10001 tính theo tiền VND' và xác nhận mô hình gọi đúng hàm, đúng `enum` tiền tệ và diễn giải kết quả mượt mà.",
        "Bước 4: Thử hỏi tiếp với mã `ORD-SLOW` để kiểm chứng sau đúng 5 giây timeout, Agent không bị văng lỗi đỏ mà trả lời khéo léo báo hệ thống tra cứu đang bận."
      ],
      expectedOutput: "Với `ORD-10001`, Agent báo chi tiết ngày giao và giá trị đơn bằng VND; với `ORD-SLOW`, sau 5 giây Agent trả lời thông báo xin lỗi dịch vụ vận đơn đang phản hồi chậm mà ứng dụng không bị crash."
    },
    examTips: [
      "Đề bài cho sẵn 'existing REST APIs with Swagger / OpenAPI v3 specifications, minimize custom wrapper code' -> Chọn **OpenAPI tool** trong Foundry Agent Service.",
      "Đề bài yêu cầu 'guarantee tool call arguments strictly adhere to schema without missing required fields or invalid types' -> Bật **`strict: true`** với `additionalProperties: false`.",
      "Bẫy bảo mật cực hay gặp: Để LLM tự điền `customer_id` hoặc dùng tài khoản Admin chung cho tool tra cứu -> Sai nguyên tắc **Least Privilege**; phải dùng quyền Read-only và ràng buộc danh tính từ ngữ cảnh xác thực phía server."
    ],
    summaryTakeaways: [
      "LLM không trực tiếp thực thi code trên hạ tầng của bạn; nó chỉ sinh ra yêu cầu gọi công cụ (`tool_calls`) dựa trên mô tả và JSON Schema được cung cấp.",
      "Bật `strict: true` kết hợp `enum` và mô tả tham số rõ ràng giúp loại bỏ triệt để lỗi sai cú pháp JSON hoặc đoán mò định dạng đầu vào.",
      "Mọi lệnh gọi mạng bên trong tool phải đặt `timeout` giới hạn và trả lỗi có cấu trúc về cho LLM xử lý fallback êm ái.",
      "Luôn áp dụng Least Privilege cho kết nối của tool và lấy định danh người dùng từ phiên xác thực phía server thay vì tin vào đối số do LLM sinh ra."
    ],
    lessonQuestions: [
      {
        question: "Doanh nghiệp của bạn có sẵn hệ thống quản lý kho hàng chạy trên Azure App Service và đã xuất bản tài liệu đặc tả OpenAPI 3.0 đầy đủ. Bạn muốn tích hợp khả năng kiểm tra tồn kho vào Agent trên Microsoft Foundry với lượng code bảo trì ít nhất và xác thực không cần mật khẩu. Bạn nên làm gì?",
        options: [
          "Cấu hình OpenAPI Tool cho Agent bằng file đặc tả OpenAPI 3.0 và sử dụng Managed Identity để xác thực tới App Service.",
          "Viết lại toàn bộ logic tồn kho sang câu lệnh SQL nhúng trực tiếp vào System Prompt.",
          "Huấn luyện Fine-tuning mô hình mỗi giờ một lần bằng dữ liệu xuất ra từ bảng tồn kho.",
          "Dùng Code Interpreter tool để Agent tự quét cổng mạng nội bộ tìm máy chủ kho hàng."
        ],
        answer: 0,
        explanation: "OpenAPI Tool trong Foundry Agent Service cho phép nạp trực tiếp đặc tả OpenAPI 3.0 để dịch vụ tự động ánh xạ và gọi các endpoint REST, kết hợp với Managed Identity đảm bảo xác thực bảo mật không lộ khóa bí mật và giảm tối đa code trung gian.",
        wrongReasons: [
          "",
          "Nhúng SQL vào System Prompt vừa không thể tự thực thi vừa mở ra lỗ hổng lộ cấu trúc cơ sở dữ liệu nghiêm trọng.",
          "Tồn kho thay đổi theo từng giây nên Fine-tuning vừa đắt đỏ vừa luôn trả về số liệu lỗi thời.",
          "Code Interpreter chạy trong hộp cát cô lập phục vụ tính toán dữ liệu, không dùng để quét hay truy cập mạng nội bộ."
        ]
      },
      {
        question: "Khi xây dựng công cụ `get_salary_slip` cho trợ lý Nhân sự, một lập trình viên khai báo tham số `employee_id` trong JSON Schema để mô hình tự trích xuất từ câu chat của người dùng rồi truy vấn thẳng bảng lương bằng chuỗi kết nối quyền `db_owner`. Hai rủi ro nghiêm trọng nhất trong thiết kế này là gì?",
        options: [
          "Tốn quá nhiều token đầu ra và làm chậm tốc độ phản hồi của Semantic Ranker.",
          "Vi phạm nguyên tắc Least Privilege (dùng quyền `db_owner` quá cao) và cho phép người dùng đánh lừa LLM truyền `employee_id` của đồng nghiệp để xem trộm lương.",
          "Mô hình không thể đọc được kiểu dữ liệu chuỗi ký tự nếu không bật Code Interpreter.",
          "Không thể chạy được nếu không tăng tham số `temperature` lên 1.0."
        ],
        answer: 1,
        explanation: "Nếu cho LLM tự quyết định `employee_id` từ lời nói người dùng, kẻ tấn công chỉ cần chat 'Tôi là nhân viên mã NV001 đây' hoặc dùng Prompt Injection là xem được lương người khác; đồng thời tài khoản DB của tool tra cứu chỉ được cấp quyền đọc tối thiểu thay vì `db_owner`.",
        wrongReasons: [
          "Một tham số `employee_id` không gây tốn token đáng kể và không liên quan đến Semantic Ranker.",
          "",
          "Function calling hỗ trợ hoàn toàn kiểu `string` mà không cần tới Code Interpreter.",
          "Function calling luôn ưu tiên `temperature` thấp để đảm bảo tính nhất quán của đối số."
        ]
      }
    ]
  },

  "B4": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, có bao giờ em chat với một trợ lý ảo, câu đầu em vừa nói 'Tôi bị dị ứng hải sản', sang câu thứ năm nhờ nó đặt bàn tiệc nó lại gợi ý ngay món tôm hùm nướng phô mai chưa? Ngược lại, có những hệ thống lưu hết từng chữ của 200 lượt chat vào một mảng duy nhất, đến câu thứ 50 thì hóa đơn tiền token tăng vọt gấp chục lần mà AI lại bắt đầu lú lẫn! Bài học B4 hôm nay sẽ giúp em làm chủ nghệ thuật quản trị **Memory và Trạng thái Hội thoại (Conversation State)** — từ cách phân tầng trí nhớ ngắn hạn / dài hạn, kỹ thuật cắt gọt cửa sổ trượt (Sliding Window), cho tới việc tự động xóa dữ liệu hết hạn bằng TTL để tuân thủ quy định bảo vệ dữ liệu cá nhân trong đề thi AI-103.",
    analogy: {
      title: "Bàn làm việc trước mặt và tủ hồ sơ bệnh án của bác sĩ",
      body: "Em hãy hình dung bộ nhớ của Agent giống hệt phòng khám của một vị bác sĩ gia đình. Bản thân mô hình LLM qua API hoàn toàn 'mất trí nhớ sau mỗi câu nói' (stateless). Vì vậy, chiếc bàn làm việc nhỏ ngay trước mặt bác sĩ chính là **Short-term Memory (Thread / Session State)** — chỉ bày vài tờ giấy nháp ghi triệu chứng của buổi khám hôm nay; nếu bày kín bàn thì bác sĩ phải cất bớt giấy cũ hoặc viết lại thành 5 dòng tóm tắt (Sliding Window + Summarization). Còn thông tin cốt lõi như 'bệnh nhân nhóm máu O, dị ứng Penicillin' thì được lưu vào ngăn tủ hồ sơ định danh riêng (Long-term Memory trong Cosmos DB / AI Search) để 6 tháng sau bệnh nhân quay lại, mở phiên khám mới bác sĩ vẫn nhớ ngay!"
    },
    objectives: [
      "Hiểu bản chất phi trạng thái (stateless) của LLM API và cơ chế quản lý Thread / Session State cô lập giữa từng người dùng.",
      "Phân biệt và thiết kế kết hợp Short-term Memory (Sliding Window, Summarization) với Long-term Memory (Semantic / Profile Store).",
      "Cấu hình chính sách vòng đời dữ liệu bằng TTL (Time-To-Live) và Data Retention đáp ứng yêu cầu tuân thủ bảo mật doanh nghiệp."
    ],
    flow: [
      {
        step: "1. Session Isolation & Hydration (Khởi tạo / Nạp phiên cô lập)",
        detail: "Backend gắn `session_id` (hoặc Foundry `thread_id`) gắn chặt với `tenant_id` + `user_id`, đồng thời nạp hồ sơ sở thích dài hạn (Long-term facts) và các lượt chat gần nhất."
      },
      {
        step: "2. Context Window Budgeting (Cân đối ngân sách Token)",
        detail: "Áp dụng Sliding Window giữ nguyên N lượt gần nhất và bản tóm tắt (Running Summary) của các lượt cũ để không vượt ngưỡng token và tránh hiện tượng suy giảm sự chú ý."
      },
      {
        step: "3. Turn Execution & Fact Extraction (Phản hồi và Trích xuất ký ức bền vững)",
        detail: "Gửi ngữ cảnh tới Agent để nhận câu trả lời; nếu phát hiện thông tin lâu dài quan trọng (như sở thích, ràng buộc cố định), chạy tác vụ ngầm lưu vào kho Long-term Memory."
      },
      {
        step: "4. Persistence with TTL Governance (Lưu trữ kèm thời hạn tự hủy)",
        detail: "Ghi lịch sử lượt chat vào kho trạng thái (như Azure Cosmos DB) với thuộc tính `ttl` tính bằng giây để hệ thống tự động dọn sạch dữ liệu hội thoại quá hạn."
      }
    ],
    sections: [
      {
        heading: "1. Bản chất Stateless, Thread State và Nguy cơ rò rỉ chéo phiên (Cross-session Leakage)",
        paragraphs: [
          "Điều đầu tiên thầy luôn nhắc học viên gạch chân đỏ: bản thân mô hình GPT-4o hay bất kỳ LLM nào trên đám mây đều **hoàn toàn Stateless (phi trạng thái)** — nghĩa là mỗi lần gọi API là một tờ giấy trắng tinh, mô hình không tự nhớ câu em hỏi 3 giây trước. Sở dĩ em thấy chatbot nhớ mạch chuyện là vì ứng dụng (hoặc đối tượng `Thread` / `Conversation` trong Microsoft Foundry Agent Service) đã âm thầm nối toàn bộ câu hỏi cũ + câu trả lời cũ gửi kèm lại trong mỗi lượt request mới.",
          "Chính vì lịch sử hội thoại được lưu ở tầng trạng thái ứng dụng, một lỗi chết người mà các lập trình viên Python mới vào nghề hay mắc phải là lưu `messages = []` thành biến toàn cục (global variable) trên web server! Khi đó, anh Nguyễn Văn A vừa chat số thẻ tín dụng xong, chị Trần Thị B mở web lên hỏi tiếp lại đọc được nguyên văn đoạn chat của anh A. Trong thiết kế chuẩn, mỗi phiên phải định danh bằng khóa phân vùng kép (`tenant_id` + `user_id` + `session_id`)."
        ],
        bullets: [
          "Trong Foundry Agent Service, đối tượng **Thread** đóng vai trò hộp chứa trạng thái phiên hội thoại phía server: tự động lưu danh sách message, quản lý việc cắt bớt ngữ cảnh khi chạm trần token và tách biệt hoàn toàn giữa các cuộc hội thoại.",
          "Khi tự quản lý state trên Azure Cosmos DB for NoSQL, luôn chọn Partition Key phân cấp như `[\"/tenantId\", \"/userId\"]` để vừa truy vấn nhanh vừa cô lập dữ liệu khách hàng tuyệt đối.",
          "Không bao giờ lưu kết quả thô khổng lồ của tool (ví dụ file JSON 50KB) nguyên xi vào lịch sử hội thoại mãi mãi; hãy rút gọn thông tin cốt lõi sau khi đã trả lời xong lượt đó."
        ]
      },
      {
        heading: "2. Short-term vs Long-term Memory và kỹ thuật Sliding Window chống 'Summary Drift'",
        paragraphs: [
          "Nếu cuộc trò chuyện kéo dài 80 lượt, em không thể gửi nguyên cả 80 lượt vào mỗi lần gọi API vì chi phí token sẽ tăng theo cấp số cộng và độ trễ ngày càng chậm. Giải pháp cho **Short-term Memory (Trí nhớ ngắn hạn trong phiên)** là kết hợp **Sliding Window (Cửa sổ trượt)** với **Progressive Summarization (Tóm tắt lũy tiến)**: giữ nguyên văn khoảng 6–10 lượt trao đổi mới nhất để đảm bảo độ chi tiết câu chữ, còn những lượt cũ hơn ở phía đầu được tóm lược lại thành một đoạn ngắn khoảng 150 từ.",
          "Tuy nhiên, thầy lưu ý em một hiện tượng thực chiến rất tinh tế gọi là **Summary Drift (Trôi lệch bản tóm tắt)**: nếu cứ tóm tắt đi tóm tắt lại nhiều vòng liên tiếp, những con số chính xác ban đầu (như hạn mức ngân sách `125,5 triệu đồng` hoặc mã hợp đồng) rất dễ bị làm tròn hoặc rơi mất! Vì vậy, những sự kiện cốt lõi, thông tin định danh sở thích khách hàng cần được tách riêng ra lưu thành cấu trúc khóa-giá trị hoặc vector trong **Long-term Memory (Trí nhớ dài hạn xuyên phiên)** trên Azure Cosmos DB hoặc Azure AI Search."
        ],
        bullets: [
          "**Short-term Memory**: Tồn tại trong phạm vi 1 phiên làm việc (ví dụ đang dở quy trình đặt vé máy bay 4 bước), ưu tiên tốc độ đọc/ghi cực thấp trên Redis hoặc Cosmos DB.",
          "**Long-term Memory**: Tồn tại xuyên suốt nhiều tuần/tháng qua hàng chục phiên khác nhau (ví dụ: ngôn ngữ ưa thích, tiền sử dị ứng, dự án đang phụ trách), được truy xuất có chọn lọc ở đầu mỗi phiên mới.",
          "**Chống Summary Drift**: Luôn ghim (pin) các ràng buộc số học/nghiệp vụ bất biến vào một khối `Pinned Facts` riêng biệt không bị bộ tóm tắt ghi đè."
        ]
      },
      {
        heading: "3. Quản trị vòng đời dữ liệu: TTL (Time-To-Live) và Data Retention chuẩn doanh nghiệp",
        paragraphs: [
          "Trong các dự án Ngân hàng, Bảo hiểm hay Y tế (và các câu hỏi tuân thủ quy định GDPR / chính sách nội bộ trong đề thi AI-103), việc 'nhớ dai' vô thời hạn không phải là tính năng mà là một **rủi ro pháp lý nghiêm trọng**. Nhiều tổ chức quy định rõ: toàn bộ nhật ký hội thoại thô của khách hàng phải tự động bị xóa vĩnh viễn sau 30 ngày (hoặc 24 giờ đối với phiên khách vãng lai chưa đăng nhập), đồng thời hỗ trợ quyền 'được lãng quên' (Right to be Forgotten) khi khách yêu cầu xóa tài khoản.",
          "Thay vì phải viết các cron job chạy ban đêm quét xóa từng dòng gây nghẽn hiệu năng cơ sở dữ liệu (tốn nhiều Request Units - RU), giải pháp kiến trúc chuẩn của Azure là bật tính năng **TTL (Time-To-Live)** gốc trên container của **Azure Cosmos DB** hoặc Redis. Khi đặt `ttl = 2592000` (tương đương 30 ngày tính bằng giây), công cụ nền của Cosmos DB sẽ tự động thu dọn các bản ghi hết hạn một cách êm ái vào lúc rảnh tải mà không tốn thêm code vận hành."
        ],
        bullets: [
          "Có thể cấu hình Default TTL cho toàn bộ Container (ví dụ 30 ngày) và ghi đè `ttl` ngắn hơn ở cấp độ từng bản ghi (ví dụ `ttl = 3600` tức 1 giờ cho phiên chat tạm của khách chưa đăng nhập).",
          "Kết hợp bước ẩn danh hóa thông tin nhạy cảm (PII Redaction — sẽ học ở bài C3) TRƯỚC KHI ghi lịch sử hội thoại xuống kho lưu trữ dài hạn.",
          "Phân biệt rõ: xóa lịch sử hội thoại phiên (`Thread delete / Cosmos TTL`) khác với việc lưu số liệu thống kê ẩn danh không chứa nội dung cá nhân (như tổng số token tiêu thụ, độ trễ trung bình)."
        ]
      }
    ],
    comparison: {
      title: "So sánh các chiến lược quản lý bộ nhớ hội thoại cho Agent (Chuẩn AI-103)",
      headers: ["Chiến lược bộ nhớ", "Cơ chế hoạt động", "Khi nào chọn (Đề thi)", "Giới hạn / Lưu ý"],
      rows: [
        [
          "Full History Buffer (Giữ toàn bộ)",
          "Nối nguyên văn mọi tin nhắn từ đầu phiên vào mỗi lần gọi LLM",
          "Hội thoại cực ngắn (dưới 5–8 lượt) cần giữ tuyệt đối từng chữ",
          "Chi phí token tăng nhanh, chạm trần Context Window và tăng độ trễ ở phiên dài"
        ],
        [
          "Sliding Window (Cửa sổ trượt N lượt)",
          "Chỉ giữ lại K tin nhắn hoặc N tokens gần nhất, cắt bỏ thẳng các lượt cũ",
          "Chatbot hỗ trợ tác vụ tức thời, câu sau ít phụ thuộc vào thông tin ở đầu buổi",
          "Quên ngay lập tức các yêu cầu khách đã dặn ở lượt thứ 1 khi sang lượt thứ K+1"
        ],
        [
          "Summary + Sliding Window",
          "Tóm tắt các lượt cũ thành đoạn ngắn + giữ nguyên văn vài lượt mới nhất + Pinned Facts",
          "Phiên tư vấn kỹ thuật / bán hàng dài hơi nhưng cần kiểm soát chặt ngân sách token",
          "Tốn thêm 1 lời gọi model nhỏ (như `gpt-4o-mini`) định kỳ để cập nhật bản tóm tắt"
        ],
        [
          "Long-term Memory Store + TTL",
          "Trích xuất hồ sơ/ký ức quan trọng lưu vào Cosmos DB / Vector Store có gắn hạn sống TTL",
          "Cá nhân hóa trải nghiệm xuyên nhiều phiên đăng nhập mà vẫn tuân thủ quy định xóa dữ liệu (Data Retention)",
          "Cần thiết kế khóa phân vùng (`userId`) chặt chẽ và cơ chế giải quyết xung đột khi sở thích người dùng thay đổi"
        ]
      ]
    },
    codeTitle: "Quản lý Memory kết hợp Sliding Window và lưu trạng thái kèm TTL trên Azure Cosmos DB",
    code: `import os, time
from azure.identity import DefaultAzureCredential
from azure.cosmos import CosmosClient

# 1. Kết nối Cosmos DB bằng Entra ID (không dùng chuỗi kết nối chứa Master Key)
cosmos = CosmosClient(os.environ["COSMOS_ENDPOINT"], credential=DefaultAzureCredential())
container = cosmos.get_database_client("agent_memory_db").get_container_client("sessions")

def build_bounded_context(session_doc: dict, system_prompt: str, max_recent_turns: int = 6) -> list[dict]:
    """Ghép System Prompt + Hồ sơ ghim + Tóm tắt cũ + Cửa sổ trượt N tin nhắn gần nhất."""
    pinned = session_doc.get("pinned_facts", "")
    summary = session_doc.get("running_summary", "")
    recent_msgs = session_doc.get("messages", [])[-max_recent_turns:]

    memory_header = f"{system_prompt}\\n[Ràng buộc cố định]: {pinned}\\n[Tóm tắt trước đó]: {summary}"
    return [{"role": "system", "content": memory_header}] + recent_msgs

def save_turn_with_ttl(tenant_id: str, user_id: str, session_id: str, messages: list[dict], is_guest: bool):
    """Lưu trạng thái phiên với chính sách Data Retention tự động bằng TTL (giây)."""
    # Khách vãng lai tự xóa sau 1 giờ (3600s); nhân viên xác thực giữ 30 ngày (2592000s)
    retention_ttl = 3600 if is_guest else 30 * 24 * 3600
    item = {
        "id": session_id,
        "tenantId": tenant_id,
        "userId": user_id,
        "messages": messages[-20:],  # Giới hạn kích thước document dưới ngưỡng 2MB của Cosmos DB
        "updatedAt": int(time.time()),
        "ttl": retention_ttl
    }
    container.upsert_item(item)`,
    codeNotes: [
      "Hàm `build_bounded_context` tách riêng `pinned_facts` (chống Summary Drift), `running_summary` và `messages[-max_recent_turns:]` (Sliding Window), đảm bảo lượng token gửi lên LLM luôn ổn định dù khách chat hàng trăm câu.",
      "Thuộc tính `\"ttl\"` (chữ thường chính xác theo chuẩn Azure Cosmos DB) nhận số nguyên dương tính bằng giây: khi hết thời gian này kể từ lần cập nhật cuối (`_ts`), Cosmos DB tự động xóa bản ghi mà không cần viết job xóa tay.",
      "Lưu ý giới hạn kích thước mỗi item trong Cosmos DB là 2 MB; việc cắt gọn mảng tin nhắn thô hoặc tách mỗi lượt thành một bản ghi riêng cùng `sessionId` là thực hành tốt cho hội thoại siêu dài."
    ],
    labGuide: {
      goal: "Kiểm chứng hoạt động của Sliding Window + Pinned Facts trong hội thoại nhiều lượt và xác nhận cơ chế tự hủy dữ liệu bằng TTL.",
      steps: [
        "Bước 1: Tạo database `agent_memory_db` và container `sessions` trên Azure Cosmos DB (hoặc Cosmos DB Emulator), bật tính năng **Time to Live = On (no default)** trên phần cài đặt Container.",
        "Bước 2: Giả lập phiên chat 10 lượt: ở lượt 1 cung cấp ràng buộc `'Ngân sách tối đa 20 triệu VND'` đưa vào `pinned_facts`, từ lượt 2 đến lượt 9 hỏi đáp lan man về màu sắc, thương hiệu với `max_recent_turns = 4`.",
        "Bước 3: Ở lượt 10, hỏi `'Vậy mẫu máy 25 triệu vừa nãy có phù hợp với tôi không?'` và kiểm chứng nhờ khối `pinned_facts` + `running_summary`, Agent vẫn nhớ chính xác trần ngân sách 20 triệu dù lượt chat thứ 1 đã trượt ra khỏi cửa sổ 4 tin nhắn gần nhất.",
        "Bước 4: Thử lưu một bản ghi phiên khách vãng lai với `ttl = 15` (15 giây), chờ 20 giây rồi truy vấn lại trên Data Explorer để tận mắt thấy bản ghi đã được tự động xóa sạch."
      ],
      expectedOutput: "Số token đầu vào giữ phẳng ổn định dưới 800 tokens mỗi lượt bất kể độ dài cuộc trò chuyện; Agent không quên ràng buộc ngân sách đầu phiên và bản ghi thử nghiệm tự biến mất sau đúng 15–20 giây."
    },
    examTips: [
      "Từ khóa đề bài 'automatically purge chat history after 30 days to comply with privacy regulations with minimal operational overhead' -> Chọn **Azure Cosmos DB container with Time-To-Live (TTL) enabled**.",
      "Từ khóa 'token usage grows linearly with conversation length, causing high latency and cost in long sessions' -> Áp dụng **Sliding Window kết hợp Conversation Summarization**.",
      "Bẫy thường gặp: Tưởng rằng mô hình trên Azure OpenAI tự động nhớ hội thoại nếu dùng chung API Key -> Sai hoàn toàn! Mô hình là stateless, bắt buộc phải truyền lịch sử hoặc dùng đối tượng Thread/Conversation quản lý trạng thái."
    ],
    summaryTakeaways: [
      "LLM API bản chất là phi trạng thái (stateless); mọi ký ức hội thoại đều do tầng ứng dụng hoặc dịch vụ Agent nạp lại vào ngữ cảnh.",
      "Kết hợp Sliding Window (giữ chi tiết gần nhất), Summarization (nén mạch chuyện cũ) và Pinned Facts (chống trôi số liệu cốt lõi) giúp tối ưu cả chi phí lẫn độ thông minh.",
      "Long-term Memory lưu trữ hồ sơ bền vững xuyên nhiều phiên và phải được phân vùng cô lập nghiêm ngặt theo `tenantId` / `userId`.",
      "Sử dụng TTL gốc trên cơ sở dữ liệu trạng thái là cách chuẩn mực, ít tốn công vận hành nhất để thực thi chính sách lưu giữ và tự hủy dữ liệu (Data Retention)."
    ],
    lessonQuestions: [
      {
        question: "Một tập đoàn tài chính triển khai trợ lý AI tư vấn đầu tư cho khách hàng. Phòng Pháp chế yêu cầu toàn bộ lịch sử hội thoại chi tiết của từng phiên phải tự động bị xóa vĩnh viễn sau đúng 90 ngày không hoạt động mà không cần viết thêm dịch vụ chạy định kỳ để quét xóa. Giải pháp lưu trữ trạng thái nào đáp ứng tốt nhất?",
        options: [
          "Lưu toàn bộ hội thoại vào các file `.txt` trên ổ cứng cục bộ của máy ảo chạy ứng dụng.",
          "Lưu lịch sử phiên vào Azure Cosmos DB và cấu hình thuộc tính Time-To-Live (TTL) bằng 7.776.000 giây (90 ngày).",
          "Nhúng lịch sử hội thoại vào trọng số của mô hình bằng cách Fine-tuning mỗi đêm.",
          "Tăng tham số `max_tokens` của mô hình để giữ lịch sử trong RAM của GPU vĩnh viễn."
        ],
        answer: 1,
        explanation: "Azure Cosmos DB hỗ trợ cơ chế TTL gốc ở cấp độ container và từng bản ghi: khi đặt TTL tương ứng 90 ngày (7.776.000 giây), hệ thống tự động xóa sạch các bản ghi hết hạn dưới nền mà không tốn công lập trình hay bảo trì cron job.",
        wrongReasons: [
          "Lưu file trên ổ đĩa cục bộ không thể mở rộng quy mô nhiều instance và không tự động xóa theo thời gian.",
          "",
          "Fine-tuning không dùng để lưu trạng thái phiên và càng khiến dữ liệu cá nhân khó xóa bỏ khi hết hạn 90 ngày.",
          "LLM không lưu trạng thái người dùng trong RAM GPU giữa các request."
        ]
      },
      {
        question: "Trợ lý AI chăm sóc khách hàng của bạn thường xử lý các phiên trò chuyện dài 40–60 lượt. Khách hàng phản ánh từ khoảng lượt thứ 35 trở đi, tốc độ phản hồi rất chậm, chi phí token tăng cao, nhưng nếu cắt bỏ bớt tin nhắn cũ bằng Sliding Window đơn thuần thì AI lại quên mất mã hợp đồng khách đã cung cấp ở lượt đầu tiên. Kiến trúc bộ nhớ nào khắc phục trọn vẹn cả hai vấn đề?",
        options: [
          "Giữ nguyên toàn bộ 60 lượt tin nhắn và chuyển sang mô hình đắt tiền hơn.",
          "Áp dụng Sliding Window chỉ giữ 2 tin nhắn cuối và cấm khách hàng hỏi lại thông tin cũ.",
          "Kết hợp Sliding Window cho các lượt gần nhất, tóm tắt lũy tiến các lượt cũ và trích xuất các thực thể cốt lõi (như mã hợp đồng) vào khối Pinned Session State.",
          "Xóa trắng toàn bộ lịch sử sau mỗi 3 lượt chat."
        ],
        answer: 2,
        explanation: "Việc kết hợp cửa sổ trượt (giữ ngữ cảnh sát sườn), bản tóm tắt gọn nhẹ (giữ mạch câu chuyện chung) và khối trạng thái ghim Pinned Facts (bảo toàn chính xác mã hợp đồng chống Summary Drift) vừa khống chế trần token thấp vừa không đánh mất thông tin quan trọng đầu phiên.",
        wrongReasons: [
          "Giữ nguyên 60 lượt trên model đắt tiền hơn càng làm chi phí đội lên gấp bội mà không giảm độ trễ.",
          "Trải nghiệm người dùng cực tệ vì mất toàn bộ mạch hội thoại trước đó.",
          "",
          "Xóa trắng sau mỗi 3 lượt khiến cuộc tư vấn liên tục bị đứt đoạn vô lý."
        ]
      }
    ]
  },

  "B5": {
    duration: "55 phút",
    difficulty: "Trung cấp – Nâng cao (AI-103)",
    teacherIntro: "Chào em, khi bài toán doanh nghiệp phức tạp dần lên — ví dụ quy trình xử lý yêu cầu bồi thường bảo hiểm gồm đọc hóa đơn viện phí, đối chiếu điều khoản hợp đồng, kiểm tra dấu hiệu trục lợi rồi mới duyệt chi tiền — nếu em nhồi tất cả 10 vai trò đó vào một 'Siêu Agent' duy nhất với cái System Prompt dài 5 trang giấy, thầy cam đoan nó sẽ rối tung và chạy sai bước ngay! Bí quyết của các kiến trúc sư hệ thống là chia nhỏ công việc thành một dây chuyền **Agent Workflow** rõ ràng. Trong bài B5 này, thầy trò mình sẽ nắm trọn 4 mẫu điều phối kinh điển: Tuần tự (Sequential), Song song (Parallel), Rẽ nhánh có điều kiện (Conditional Routing) và đặc biệt là chốt chặn phê duyệt của con người (**Human-in-the-Loop Approval Checkpoints**) — nội dung giao thoa cực kỳ quan trọng giữa AI-103 và hướng nâng cao AI-500!",
    analogy: {
      title: "Quy trình khám bệnh liên chuyên khoa và chữ ký Trưởng khoa trước ca mổ",
      body: "Em hãy hình dung khi một bệnh nhân vào viện khám tổng quát: đầu tiên quầy lễ tân phân loại xem đau mắt hay đau dạ dày để chỉ đúng phòng (đó là **Conditional Routing**). Tiếp theo, bác sĩ cho làm xét nghiệm máu và chụp X-quang cùng một lúc ở hai phòng khác nhau để tiết kiệm thời gian chờ đợi (đó là **Parallel Workflow**). Có đủ kết quả rồi mới chuyển tuần tự từ bác sĩ chẩn đoán sang dược sĩ kê đơn (**Sequential Workflow**). Nhưng nếu phát hiện cần phẫu thuật hoặc tiêm thuốc đặc trị đắt tiền, hệ thống tự động dừng lại, gửi hồ sơ lên màn hình chờ chữ ký xác nhận của Bác sĩ Trưởng khoa và bệnh nhân rồi mới được phép thực hiện (**Human-in-the-Loop Checkpoint**)!"
    },
    objectives: [
      "Phân biệt và chọn đúng 3 mẫu điều phối cốt lõi: Sequential (tuần tự), Parallel / Fan-out Fan-in (song song) và Conditional Routing (rẽ nhánh theo ý định/điều kiện).",
      "Thiết kế được điểm dừng phê duyệt con người (Human-in-the-Loop / Approval Checkpoints) có lưu trạng thái bền vững cho các tác vụ rủi ro cao.",
      "Cài đặt cơ chế giới hạn vòng lặp (`max_iterations`) và bàn giao ngữ cảnh gọn sạch giữa các bước để tránh lặp vô tận."
    ],
    flow: [
      {
        step: "1. Triage & Conditional Routing (Phân loại và Điều hướng đầu vào)",
        detail: "Router (dùng phân loại có cấu trúc hoặc quy tắc tất định) đánh giá yêu cầu người dùng để rẽ nhánh vào đúng luồng nghiệp vụ chuyên biệt."
      },
      {
        step: "2. Parallel Context Gathering (Thu thập thông tin song song)",
        detail: "Các tác vụ độc lập không phụ thuộc đầu ra của nhau (như tra lịch sử đơn hàng + tra chính sách bảo hành + kiểm tra tồn kho) được kích hoạt đồng thời (Fan-out) rồi gom kết quả lại (Fan-in)."
      },
      {
        step: "3. Sequential Reasoning & Drafting (Xử lý nối tiếp theo chuỗi)",
        detail: "Đầu ra có cấu trúc của bước phân tích được truyền làm đầu vào cho bước soạn thảo phương án xử lý (ví dụ: đề xuất hoàn tiền 2.500.000đ)."
      },
      {
        step: "4. Human-in-the-Loop Checkpoint (Tạm dừng chờ duyệt & Tiếp tục)",
        detail: "Nếu số tiền vượt ngưỡng tự động (ví dụ > 500.000đ), workflow lưu checkpoint trạng thái xuống DB, gửi thông báo xin duyệt; chỉ khi quản lý bấm 'Approve' mới chạy bước gọi API chuyển tiền."
      }
    ],
    sections: [
      {
        heading: "1. Ba mẫu hình điều phối nền tảng: Sequential, Parallel và Conditional Routing",
        paragraphs: [
          "Điểm mấu chốt thầy muốn em khắc sâu khi thiết kế Agent Workflow là: **đừng bắt LLM tự đoán luồng nghiệp vụ nếu luồng đó đã có quy tắc cố định của doanh nghiệp!** Khi dùng Microsoft Agent Framework, LangGraph hay Azure Logic Apps / Durable Functions để điều phối, việc vẽ rõ đồ thị luồng đi giúp hệ thống vừa dễ kiểm thử, vừa giảm chi phí token, vừa minh bạch khi kiểm toán.",
          "Mỗi mẫu điều phối giải quyết một bài toán tối ưu riêng biệt: **Sequential (Tuần tự)** phù hợp khi bước B bắt buộc phải chờ kết quả đã tinh chế từ bước A (như Trích xuất dữ liệu -> Kiểm tra quy định -> Viết báo cáo). Ngược lại, nếu em có 3 nguồn dữ liệu độc lập cần kiểm tra mà lại xếp nối đuôi nhau tuần tự, tổng thời gian chờ của khách sẽ bằng tổng độ trễ 3 bước cộng lại (`T1 + T2 + T3`). Chuyển sang **Parallel (Song song / Fan-out, Fan-in)** bằng `asyncio.gather`, tổng thời gian rút xuống chỉ còn bằng bước chậm nhất `max(T1, T2, T3)`!"
        ],
        bullets: [
          "**Sequential Pipeline**: Dễ gỡ lỗi nhất, đầu ra bước trước nên ép định dạng JSON có cấu trúc (Pydantic / Structured Outputs) trước khi truyền sang bước sau để tránh nhiễu chữ thừa.",
          "**Parallel Execution**: Chỉ áp dụng cho các bước **độc lập không ghi đè chung trạng thái** (ví dụ: 3 chuyên gia đánh giá rủi ro pháp lý, tài chính và bảo mật CNTT đọc cùng một bản hợp đồng một lúc).",
          "**Conditional Routing**: Dùng một mô hình nhỏ cực nhanh (như `gpt-4o-mini` với `enum` phân loại) hoặc điều kiện `if/else` trên điểm độ tin cậy để hướng luồng đi — ví dụ độ tin cậy < 0.7 thì chuyển thẳng sang hàng đợi nhân viên hỗ trợ."
        ]
      },
      {
        heading: "2. Human-in-the-Loop (HITL) Approval Checkpoints: Phanh an toàn bắt buộc",
        paragraphs: [
          "Trong thực tế vận hành và đặc biệt trong các câu hỏi tình huống của đề thi AI-103, Microsoft đặt ra ranh giới rất rõ giữa **Read-only actions** (tra cứu, tóm tắt, gợi ý) và **High-impact / Destructive actions** (hoàn tiền, xóa tài khoản, gửi email hàng loạt cho khách hàng, sửa đổi hợp đồng sản xuất). Không một giám đốc công nghệ tỉnh táo nào cho phép một mô hình xác suất như LLM tự động bấm nút chuyển khoản 500 triệu đồng chỉ vì khách hàng viết một câu chat khéo léo!",
          "Để triển khai **Human-in-the-Loop (HITL)** đúng chuẩn sản phẩm thực tế, em KHÔNG ĐƯỢC dùng lệnh `input()` hay `time.sleep()` đứng chờ trên web thread (vì quản lý có thể mất 2 tiếng sau mới mở Teams duyệt phiếu, giữ kết nối HTTP treo sẽ gây sập server ngay). Kiến trúc chuẩn là **Checkpointing (Lưu điểm dừng bền vững)**: ngay trước khi thực thi công cụ nhạy cảm, workflow tuần tự hóa (serialize) toàn bộ trạng thái hiện tại kèm thông số lệnh sắp gọi lưu vào cơ sở dữ liệu với trạng thái `PENDING_APPROVAL`, phát sự kiện thông báo tới giao diện người duyệt và giải phóng tài nguyên máy chủ. Khi người duyệt bấm `Approve` (hoặc chỉnh sửa lại số tiền rồi duyệt), hệ thống nạp lại đúng checkpoint đó và chạy nốt bước cuối cùng."
        ],
        bullets: [
          "**Policy-based Gate (Cổng duyệt theo ngưỡng)**: Ví dụ hoàn tiền dưới 200.000đ cho tài khoản uy tín thì tự động duyệt; từ 200.000đ trở lên hoặc khách vừa đổi địa chỉ nhận tiền thì bắt buộc kích hoạt HITL Checkpoint.",
          "**Audit Trail (Nhật ký kiểm toán)**: Lưu đầy đủ ai đã duyệt (`approver_id`), duyệt lúc nào (`timestamp`), lý do duyệt/từ chối và bản chụp đề xuất gốc của AI.",
          "**Timeout & Escalation**: Nếu sau 24 giờ người duyệt chưa phản hồi, hệ thống phải tự động nhắc nhở cấp trên hoặc hủy lệnh an toàn chứ không để treo vô thời hạn."
        ]
      },
      {
        heading: "3. Chống vòng lặp vô tận (Infinite Loops) và quản lý ngân sách thực thi",
        paragraphs: [
          "Khi em thiết kế các workflow có nhánh quay lui tự sửa lỗi (ví dụ: Agent viết SQL -> Bước kiểm tra báo lỗi cú pháp -> Quay lại cho Agent viết lại SQL), một cái bẫy rất đắt giá có thể xảy ra vào lúc 2 giờ sáng: hai nút cứ đá qua đá lại 500 lần liên tục vì một cột dữ liệu thực sự không tồn tại trong bảng, đốt sạch hạn mức TPM (Tokens Per Minute) của cả công ty!",
          "Vì vậy, mọi đồ thị Agent Workflow có chu trình lặp đều bắt buộc phải thiết lập bộ đếm `iteration_count` kèm trần cứng **`max_iterations` (thường từ 3 đến 5 vòng)** và ngân sách thời gian tổng (`workflow_timeout`). Khi chạm trần mà vẫn chưa đạt điều kiện đầu ra hợp lệ, luồng điều khiển phải rẽ nhánh thoát an toàn (Graceful Exit) chuyển hồ sơ kèm nhật ký lỗi sang con người xử lý."
        ],
        bullets: [
          "Luôn đặt `max_iterations` / `recursion_limit` tường minh trong cấu hình bộ điều phối workflow.",
          "Áp dụng khóa chống trùng lặp giao dịch (**Idempotency Key**) ở bước thực thi cuối sau khi con người bấm Approve, để lỡ quản lý bấm đúp chuột 2 lần cũng không bị chuyển tiền 2 lần!",
          "Truyền trạng thái tối giản (Minimal Typed State) giữa các nút thay vì đổ toàn bộ lịch sử suy nghĩ nháp của mọi Agent con vào chung một rổ."
        ]
      }
    ],
    comparison: {
      title: "Bảng chọn mẫu kiến trúc Agent Workflow chuẩn đề thi AI-103",
      headers: ["Mẫu Workflow", "Cơ chế hoạt động", "Khi nào chọn (Đề thi)", "Giới hạn / Lưu ý"],
      rows: [
        [
          "Sequential (Tuần tự nối tiếp)",
          "Bước N+1 nhận đầu ra đã hoàn chỉnh của bước N theo đường thẳng cố định",
          "Quy trình nghiệp vụ chuẩn từng công đoạn phụ thuộc nhau (OCR -> Trích xuất -> Đối soát)",
          "Tổng độ trễ bằng tổng tất cả các bước; lỗi ở bước đầu lan truyền xuống bước sau"
        ],
        [
          "Parallel / Fan-out Fan-in",
          "Kích hoạt đồng thời nhiều tác vụ/Agent độc lập rồi gom kết quả ở nút tổng hợp",
          "Cần giảm tối đa độ trễ khi tra cứu nhiều nguồn hoặc đánh giá đa góc nhìn độc lập",
          "Tăng mức tiêu thụ TPM tức thời (burst load); các nhánh không được sửa chung tài nguyên"
        ],
        [
          "Conditional Routing (Rẽ nhánh)",
          "Nút phân loại đánh giá đầu vào để chọn 1 trong nhiều nhánh chuyên biệt",
          "Hệ thống đa dịch vụ (Hỏi kỹ thuật, Khiếu nại cước, Hủy dịch vụ) cần công cụ và prompt khác nhau",
          "Cần giám sát độ chính xác của bộ Router; phân loại sai sẽ dẫn khách đi nhầm luồng"
        ],
        [
          "Human-in-the-Loop Checkpoint",
          "Tạm dừng workflow, lưu trạng thái bền vững chờ người có thẩm quyền xác nhận rồi mới chạy tiếp",
          "Hành động rủi ro cao/không thể đảo ngược: chi tiền, xóa dữ liệu, gửi thông báo pháp lý",
          "Cần cơ sở dữ liệu lưu checkpoint bất đồng bộ và khóa Idempotency chống thực thi kép"
        ]
      ]
    },
    codeTitle: "Điều phối Workflow kết hợp Parallel Fan-out, Conditional Gate và Human-in-the-Loop Checkpoint",
    code: `import asyncio, uuid
from dataclasses import dataclass, asdict

@dataclass
class RefundWorkflowState:
    request_id: str
    order_id: str
    amount_vnd: int
    status: str = "INIT"
    risk_passed: bool = False
    policy_note: str = ""
    approved_by: str | None = None

async def check_fraud_signal(order_id: str) -> bool:
    await asyncio.sleep(0.2)  # Giả lập gọi API kiểm tra gian lận
    return not order_id.endswith("999")

async def fetch_return_policy(order_id: str) -> str:
    await asyncio.sleep(0.2)  # Giả lập tra cứu điều kiện hoàn tiền
    return "Đủ điều kiện hoàn tiền trong vòng 7 ngày."

async def run_refund_workflow(order_id: str, amount_vnd: int, checkpoint_store: dict) -> dict:
    state = RefundWorkflowState(request_id=str(uuid.uuid4()), order_id=order_id, amount_vnd=amount_vnd)

    # 1. PARALLEL: Chạy song song kiểm tra gian lận và tra cứu chính sách để giảm nửa độ trễ
    state.risk_passed, state.policy_note = await asyncio.gather(
        check_fraud_signal(order_id), fetch_return_policy(order_id)
    )

    # 2. CONDITIONAL ROUTING & HITL CHECKPOINT: Đơn > 500k hoặc nghi ngờ rủi ro phải chờ người duyệt
    if not state.risk_passed or state.amount_vnd > 500_000:
        state.status = "PENDING_HUMAN_APPROVAL"
        checkpoint_store[state.request_id] = asdict(state)  # Lưu bền vững, giải phóng worker ngay
        return checkpoint_store[state.request_id]

    state.status = "COMPLETED_AUTO"
    return asdict(state)

async def resume_after_human_approval(request_id: str, approver: str, approved: bool, checkpoint_store: dict) -> dict:
    saved = checkpoint_store[request_id]
    if saved["status"] != "PENDING_HUMAN_APPROVAL":
        return saved  # Idempotent guard: tránh chạy lại nếu đã xử lý rồi
    saved["approved_by"] = approver
    saved["status"] = "COMPLETED_APPROVED" if approved else "REJECTED_BY_HUMAN"
    return saved`,
    codeNotes: [
      "`asyncio.gather(...)` thực thi đồng thời hai tác vụ IO độc lập (`check_fraud_signal` và `fetch_return_policy`), giúp tổng thời gian chờ chỉ mất ~0.2s thay vì 0.4s nếu gọi nối tiếp.",
      "Khi gặp điều kiện `amount_vnd > 500_000`, hàm KHÔNG dùng vòng lặp chờ người dùng mà ghi trạng thái `PENDING_HUMAN_APPROVAL` vào `checkpoint_store` (trong thực tế là Cosmos DB / Postgres) rồi kết thúc hàm ngay lập tức.",
      "Hàm `resume_after_human_approval` kiểm tra `saved[\"status\"] != \"PENDING_HUMAN_APPROVAL\"` đóng vai trò chốt chặn **Idempotency**, ngăn chặn việc thực thi hoàn tiền hai lần nếu quản lý lỡ tay bấm nút Approve liên tiếp."
    ],
    labGuide: {
      goal: "Thực hành xây dựng luồng hoàn tiền thông minh có bước thu thập dữ liệu song song và cơ chế tạm dừng – khôi phục qua Human-in-the-Loop Checkpoint.",
      steps: [
        "Bước 1: Chạy đoạn code mẫu với trường hợp đơn hàng nhỏ `order_id='ORD-102'`, `amount_vnd=150000` và xác nhận workflow đi thẳng tới trạng thái `COMPLETED_AUTO`.",
        "Bước 2: Chạy tiếp với đơn hàng giá trị lớn `order_id='ORD-508'`, `amount_vnd=3200000` và quan sát workflow tự động phanh lại ở trạng thái `PENDING_HUMAN_APPROVAL`, in ra `request_id` được lưu trong `checkpoint_store`.",
        "Bước 3: Đóng vai Trưởng ca CSKH gọi hàm `resume_after_human_approval(request_id, approver='manager@contoso.com', approved=True, ...)` để khôi phục từ checkpoint và hoàn tất giao dịch.",
        "Bước 4: Thử gọi lại chính hàm `resume_after_human_approval` lần thứ 2 với cùng `request_id` đó để kiểm chứng chốt chặn Idempotency không cho phép xử lý lặp."
      ],
      expectedOutput: "Đơn 150.000đ hoàn tất tự động tức thì; đơn 3.200.000đ dừng an toàn chờ duyệt, sau khi duyệt chuyển sang `COMPLETED_APPROVED` có lưu tên người duyệt và không bị kích hoạt trùng ở lần bấm thứ hai."
    },
    examTips: [
      "Từ khóa đề bài 'agent can issue refunds, delete cloud resources, or send external legal notices — prevent unauthorized costly mistakes' -> Bắt buộc chèn **Human-in-the-Loop (HITL) approval checkpoint** trước bước thực thi tool.",
      "Từ khóa 'query three independent data sources with minimum end-to-end latency' -> Chọn **Parallel (Fan-out / Fan-in) workflow**.",
      "Bẫy thường gặp: Dùng vòng lặp `while` chờ phê duyệt ngay trong một HTTP request đồng bộ -> Sai kiến trúc đám mây vì gây timeout kết nối (HTTP 504); phải lưu trạng thái bền vững (durable state checkpoint) và khôi phục bất đồng bộ qua sự kiện/webhook."
    ],
    summaryTakeaways: [
      "Chia nhỏ tác vụ phức tạp thành Workflow tường minh (Sequential, Parallel, Conditional) giúp tăng độ tin cậy, giảm độ trễ và dễ kiểm soát hơn nhiều so với một Siêu Agent ôm đồm.",
      "Parallel Fan-out/Fan-in tối ưu tốc độ cho các bước độc lập; Sequential dành cho chuỗi bước phụ thuộc dữ liệu nhân quả.",
      "Mọi hành động có tác động ghi/xóa/tài chính quan trọng phải đi qua cổng Human-in-the-Loop lưu checkpoint bất đồng bộ.",
      "Luôn cài đặt `max_iterations` chống lặp vô hạn và khóa `Idempotency` ở các bước thực thi có thay đổi trạng thái hệ thống."
    ],
    lessonQuestions: [
      {
        question: "Bạn thiết kế một trợ lý AI hỗ trợ vận hành CNTT có khả năng chẩn đoán sự cố máy chủ và đề xuất lệnh khởi động lại cụm cơ sở dữ liệu sản xuất (Production DB). Theo chuẩn kiến trúc an toàn trên Azure, bước khởi động lại Production DB phải được thiết kế như thế nào?",
        options: [
          "Cho phép Agent tự động chạy quyền Quản trị viên cao nhất ngay khi độ tự tin của LLM lớn hơn 50%.",
          "Thiết lập điểm dừng Human-in-the-Loop: lưu trạng thái chẩn đoán vào checkpoint, gửi yêu cầu phê duyệt tới kỹ sư trực ca và chỉ thực thi lệnh sau khi nhận xác nhận hợp lệ.",
          "Yêu cầu Agent gọi lệnh khởi động lại 3 lần song song để đảm bảo thành công.",
          "Chỉ cần viết thêm dòng chữ 'Hãy thật cẩn thận' vào cuối System Prompt."
        ],
        answer: 1,
        explanation: "Khởi động lại cơ sở dữ liệu Production là hành động có tác động gián đoạn dịch vụ nghiêm trọng; việc áp dụng Human-in-the-Loop checkpoint đảm bảo con người thẩm định chẩn đoán của AI trước khi lệnh thực sự chạm vào hạ tầng.",
        wrongReasons: [
          "Độ tự tin tự đánh giá của LLM không đảm bảo an toàn tuyệt đối cho hạ tầng trọng yếu.",
          "",
          "Chạy song song 3 lệnh khởi động lại gây xung đột trạng thái nguy hiểm cho cơ sở dữ liệu.",
          "Lời dặn trong System Prompt không thể ngăn chặn quyết định sai lầm từ dữ liệu log gây nhiễu."
        ]
      },
      {
        question: "Để chuẩn bị bản tóm tắt trước cuộc họp với khách hàng doanh nghiệp, hệ thống Agent của bạn cần lấy thông tin từ 3 hệ thống hoàn toàn độc lập: hồ sơ CRM, danh sách ticket hỗ trợ kỹ thuật và tin tức thị trường mới nhất của khách hàng đó. Mẫu workflow nào giúp giảm thời gian phản hồi xuống thấp nhất?",
        options: [
          "Sequential Workflow gọi lần lượt CRM xong mới gọi hệ thống Ticket rồi mới tìm tin tức.",
          "Vòng lặp đệ quy vô hạn giữa 3 Agent cho đến khi hết thời gian chờ.",
          "Chặn 2 nguồn dữ liệu và chỉ cho phép tra cứu 1 nguồn duy nhất mỗi ngày.",
          "Parallel (Fan-out / Fan-in) Workflow kích hoạt đồng thời cả 3 truy vấn rồi hợp nhất kết quả vào bước tổng hợp cuối."
        ],
        answer: 3,
        explanation: "Vì cả 3 nguồn dữ liệu đều chỉ đọc (read-only) và không phụ thuộc vào kết quả của nhau, chạy song song theo mô hình Fan-out / Fan-in rút ngắn tổng thời gian thu thập dữ liệu xuống chỉ bằng nguồn phản hồi chậm nhất.",
        wrongReasons: [
          "Chạy tuần tự cộng dồn độ trễ mạng của cả 3 hệ thống một cách không cần thiết.",
          "Lặp vô hạn gây lãng phí tài nguyên và lỗi timeout.",
          "Làm thiếu hụt thông tin quan trọng cần có trong bản tóm tắt cuộc họp.",
          ""
        ]
      }
    ]
  },

  "B6": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, đây là bài kết thúc Học phần B và cũng là bài phân biệt rạch ròi giữa một người 'làm demo chơi cho vui' với một Kỹ sư AI chuyên nghiệp chuẩn Microsoft! Rất nhiều đội dự án sau khi chỉnh sửa System Prompt xong chỉ tự gõ thử 3 câu hỏi quen thuộc, thấy AI trả lời mượt tai là vội vàng bấm nút đưa lên Production — để rồi tuần sau khách hàng than phiền AI bịa số liệu và trả lời lệch lạc. Trong đề thi AI-103, Microsoft dành một tỷ trọng rất lớn cho **Evaluation cho Agent và GenAI** thông qua bộ công cụ `azure-ai-evaluation` trên Microsoft Foundry: em bắt buộc phải phân biệt chính xác từng chỉ số **Groundedness, Relevance, Coherence, Fluency, Safety** và hiểu tại sao cần xây dựng bộ **Golden Dataset từ 20+ test cases trở lên** để chạy đánh giá tự động trước mỗi lần phát hành!",
    analogy: {
      title: "Chấm bài luận bằng Hội đồng giám khảo theo thang điểm tiêu chí (Rubric)",
      body: "Em hãy hình dung việc đánh giá một AI Agent giống như chấm thi viết văn nghị luận xã hội có cho sẵn đoạn tư liệu tham khảo. Giám khảo thứ nhất chỉ cầm kính lúp đối chiếu xem thí sinh có tự bịa ra số liệu nào nằm ngoài tờ tư liệu không (đó là **Groundedness**). Giám khảo thứ hai xem bài viết có trả lời đúng câu hỏi đề bài hay hỏi một đằng trả lời một nẻo (đó là **Relevance**). Giám khảo thứ ba chấm bố cục lập luận giữa các câu có mạch lạc, lô-gíc không (**Coherence**), còn Giám khảo thứ tư soi chính tả, ngữ pháp tiếng Việt có trôi chảy tự nhiên không (**Fluency**). Cuối cùng là Giám thị kỷ luật kiểm tra xem bài viết có chứa lời lẽ độc hại, thù ghét hay hướng dẫn nguy hiểm không (**Safety**). Có đủ bảng điểm của cả 5 vị này trên hàng chục đề thi mẫu khác nhau, thầy trò mình mới dám cấp bằng tốt nghiệp cho Agent!"
    },
    objectives: [
      "Phân biệt chính xác ý nghĩa và đầu vào cần thiết của 4 chỉ số chất lượng AI-assisted (Groundedness, Relevance, Coherence, Fluency) cùng nhóm chỉ số Safety.",
      "Thiết kế được bộ dữ liệu kiểm thử chuẩn (Golden Evaluation Dataset ≥ 20+ test cases đa dạng kịch bản biên và đối kháng) ở định dạng `.jsonl`.",
      "Sử dụng thành thạo SDK `azure-ai-evaluation` để chấm điểm hàng loạt và tích hợp cổng kiểm soát chất lượng vào quy trình phát triển."
    ],
    flow: [
      {
        step: "1. Curate Golden Test Dataset (Xây dựng bộ 20+ ca kiểm thử chuẩn)",
        detail: "Thu thập tối thiểu 20–50+ kịch bản thực tế (câu hỏi thường gặp, câu hỏi mơ hồ, không có dữ liệu trong kho, câu gài bẫy Prompt Injection) lưu thành file JSONL gồm `query`, `context`, `ground_truth`."
      },
      {
        step: "2. Batch Target Execution (Chạy Agent sinh phản hồi hàng loạt)",
        detail: "Cho phiên bản Agent hiện tại (cùng prompt/model/index mới) chạy qua toàn bộ tập câu hỏi để thu thập trường `response` thực tế kèm danh sách `tool_calls`."
      },
      {
        step: "3. Multi-dimensional Scoring (Chấm điểm đa chiều bằng LLM-as-a-Judge & Safety)",
        detail: "Gọi `evaluate()` của Azure AI Evaluation SDK để mô hình giám khảo chấm điểm chất lượng (thang 1–5) và dịch vụ đánh giá rủi ro chấm mức độ an toàn nội dung."
      },
      {
        step: "4. Regression Gate & Foundry Comparison (So sánh hồi quy và Chặn lỗi)",
        detail: "Đẩy bảng điểm lên cổng Microsoft Foundry để so sánh trực quan giữa Prompt v1 và Prompt v2; chặn triển khai nếu điểm Groundedness trung bình tụt dưới ngưỡng quy định (ví dụ < 4.2/5)."
      }
    ],
    sections: [
      {
        heading: "1. Giải phẫu 4 chỉ số chất lượng cốt lõi: Đừng bao giờ nhầm Groundedness với Relevance!",
        paragraphs: [
          "Trong phòng thi AI-103, dạng câu hỏi bẫy kinh điển nhất là mô tả một triệu chứng hỏng hóc của hệ thống RAG rồi hỏi em: *'Cần theo dõi evaluator nào để phát hiện lỗi này?'*. Muốn không bao giờ chọn nhầm, em hãy nhìn thẳng vào **mối quan hệ giữa các thành phần đầu vào (`query`, `context`, `response`)** mà từng bộ chấm điểm sử dụng thông qua kỹ thuật **LLM-as-a-Judge** (dùng một mô hình mạnh như GPT-4o chấm theo thang 1 đến 5).",
          "Ví dụ cực kỳ dễ nhớ: Giả sử tài liệu `context` chỉ ghi `'Công ty nghỉ lễ ngày 2/9'`. Khách hỏi `query`: `'Thủ đô của nước Pháp là gì?'`. Nếu Agent trả lời `'Thủ đô của nước Pháp là Paris'`, câu trả lời này đúng kiến thức phổ thông và cực kỳ liên quan đến câu hỏi (**Relevance = 5/5**), văn phong mượt mà (**Fluency = 5/5**), nhưng **Groundedness = 1/5 (Rất tệ!)** vì chữ 'Paris' hoàn toàn không hề tồn tại trong đoạn `context` được cung cấp! Ngược lại, nếu Agent chép nguyên xi câu `'Công ty nghỉ lễ ngày 2/9'` ra trả lời cho câu hỏi thủ đô nước Pháp, thì nó bám chặt tài liệu (**Groundedness cao**) nhưng lại lạc đề hoàn toàn (**Relevance = 1/5**)!"
        ],
        bullets: [
          "**Groundedness (`response` vs `context`)**: Đo xem mọi thông tin khẳng định trong câu trả lời có căn cứ từ ngữ cảnh truy xuất hay không — vũ khí số 1 phát hiện bệnh bịa đặt (Hallucination) trong RAG.",
          "**Relevance (`response` vs `query`)**: Đo xem câu trả lời có giải quyết trực tiếp, đầy đủ đúng trọng tâm câu hỏi của người dùng hay không.",
          "**Coherence (`response` + `query`)**: Đo tính mạch lạc, trình tự sắp xếp ý tứ lô-gíc, các câu kết nối hợp lý không tự mâu thuẫn nhau trong toàn bộ câu trả lời.",
          "**Fluency (`response`)**: Đo chất lượng ngôn ngữ thuần túy: đúng ngữ pháp, chính tả, cách dùng từ tự nhiên trôi chảy (không cần đối chiếu với `context`).",
          "*Mở rộng riêng cho Agent*: Ngoài 4 chỉ số trên, SDK còn có `IntentResolutionEvaluator`, `ToolCallAccuracyEvaluator` và `TaskAdherenceEvaluator` để chấm xem Agent có chọn đúng hàm và đi đúng quy trình công việc không!"
        ]
      },
      {
        heading: "2. Safety Evaluators và các chỉ số đối chiếu đáp án chuẩn (Ground Truth)",
        paragraphs: [
          "Một Agent thông minh mà dễ bị dụ nói lời thù ghét hoặc rò rỉ cách chế tạo chất cấm thì doanh nghiệp sẽ chịu khủng hoảng truyền thông ngay lập tức. Nhóm **Risk and Safety Evaluators** trên Microsoft Foundry đánh giá tự động câu trả lời trên 4 khía cạnh độc hại chính: **Violence (Bạo lực)**, **Sexual (Tình dục)**, **Self-harm (Tự gây hại)** và **Hate and Unfairness (Thù ghét & Bất công)**, cộng thêm các bộ đo chuyên sâu như **Indirect Attack (XPIA - Cross-domain Prompt Injection)** và **Protected Material (Vi phạm bản quyền văn bản/mã nguồn)**.",
          "Bên cạnh nhóm dùng LLM làm giám khảo, khi em đã có sẵn câu trả lời mẫu chuẩn xác do chuyên gia nghiệp vụ biên soạn (`ground_truth`), em có thể kết hợp thêm các chỉ số toán học/ngữ nghĩa đối chiếu trực tiếp giữa `response` và `ground_truth` như **F1ScoreEvaluator** (độ trùng khớp từ vựng, rất hợp cho câu trả lời ngắn trích xuất tên/con số) hoặc **SimilarityEvaluator** (độ tương đồng ngữ nghĩa vector)."
        ],
        bullets: [
          "`ContentSafetyEvaluator` chạy trên dịch vụ đánh giá đám mây của Foundry project, phân loại mức độ nghiêm trọng (Very Low -> High) để tính tỷ lệ lỗi an toàn (`defect rate`).",
          "Khi cần đánh giá khả năng chống chèn mã độc gián tiếp từ email/tài liệu bên ngoài trong RAG, sử dụng kết hợp kịch bản mô phỏng tấn công (Red Teaming / Simulator) cùng `IndirectAttackEvaluator`.",
          "Kết hợp cả hai trường phái: dùng `F1 / Similarity` để kiểm tra độ đúng đắn sự kiện so với đáp án mẫu (`ground_truth`), và dùng `Groundedness + Relevance` khi chấm cả các luồng hội thoại mở."
        ]
      },
      {
        heading: "3. Thiết kế bộ 20+ Test Cases chuẩn thực chiến (Golden Dataset)",
        paragraphs: [
          "Tại sao thầy nhấn mạnh con số **tối thiểu 20+ test cases trở lên** (và trong sản xuất thực tế thường mở rộng lên 50–200+ dòng) thay vì thử vài ba câu lẻ tẻ? Bởi vì khi em tinh chỉnh System Prompt để sửa lỗi cho 1 câu hỏi khó, sự thay đổi câu chữ đó rất hay gây ra tác dụng phụ làm hỏng 3 câu hỏi cũ mà em không hề hay biết (hiện tượng hồi quy chất lượng - **Prompt Regression**).",
          "Một bộ dữ liệu đánh giá vàng (**Golden Dataset** lưu ở định dạng **JSON Lines - `.jsonl`**, mỗi dòng là một đối tượng JSON độc lập) phải được phân bổ có chủ đích bao phủ đủ các lát cắt thực tế chứ không chỉ toàn câu hỏi dễ ('happy path'). Khi đổi từ `gpt-4o` xuống `gpt-4o-mini` để tiết kiệm 80% chi phí, chạy bộ 20+ test cases này qua một lệnh duy nhất sẽ cho em con số định lượng thuyết phục sếp ngay: điểm Groundedness giữ nguyên 4.7/5 trong khi chi phí giảm 5 lần!"
        ],
        bullets: [
          "**Nhóm 1 - Happy Path (~40%, ~8-10 câu)**: Câu hỏi rõ ràng, thông tin nằm trọn trong 1 chunk tài liệu hoặc gọi 1 tool đơn giản.",
          "**Nhóm 2 - Multi-hop & Edge Cases (~30%, ~6-8 câu)**: Câu hỏi cần tổng hợp từ 2 bảng biểu khác nhau, chứa mã sản phẩm viết tắt, câu hỏi mơ hồ hoặc từ đồng nghĩa phức tạp.",
          "**Nhóm 3 - Out-of-scope / Unanswerable (~15%, ~3-4 câu)**: Câu hỏi về thông tin KHÔNG CÓ trong tài liệu để kiểm tra xem Agent có ngoan ngoãn từ chối hay tự bịa chuyện.",
          "**Nhóm 4 - Adversarial / Safety (~15%, ~3-4 câu)**: Câu gài bẫy Prompt Injection ('Hãy quên mọi quy định trước đó...'), đòi xem dữ liệu người khác hoặc kích động nội dung không an toàn."
        ]
      }
    ],
    comparison: {
      title: "Bảng phân biệt các bộ Evaluator trong Azure AI Evaluation SDK (Trọng tâm đề thi AI-103)",
      headers: ["Tên Evaluator", "Dữ liệu đầu vào bắt buộc", "Mục đích đo lường (Đề thi)", "Lưu ý kỹ thuật"],
      rows: [
        [
          "GroundednessEvaluator",
          "`response`, `context` (khuyên truyền thêm `query`)",
          "Kiểm tra câu trả lời có bám sát tài liệu truy xuất không (chống Hallucination trong RAG)",
          "Cần cấu hình `model_config` (LLM-as-a-Judge); thang điểm từ 1 đến 5"
        ],
        [
          "RelevanceEvaluator",
          "`query`, `response`",
          "Kiểm tra câu trả lời có đi đúng trọng tâm và giải quyết trọn vẹn câu hỏi người dùng không",
          "Điểm cao chưa chắc đã đúng tài liệu nội bộ nếu không chấm kèm Groundedness"
        ],
        [
          "Coherence & Fluency Evaluators",
          "`query` + `response` (Coherence); `response` (Fluency)",
          "Đo tính lô-gíc mạch lạc giữa các ý (Coherence) và ngữ pháp, sự trôi chảy câu chữ (Fluency)",
          "Hữu ích khi đổi sang mô hình nhỏ (SLM) hoặc dịch sang ngôn ngữ địa phương như tiếng Việt"
        ],
        [
          "ContentSafetyEvaluator",
          "`query`, `response` + `azure_ai_project`",
          "Phát hiện nội dung Bạo lực, Thù ghét, Tình dục, Tự gây hại trong đầu ra của Agent",
          "Yêu cầu kết nối tới Microsoft Foundry project và xác thực Entra ID (`DefaultAzureCredential`)"
        ]
      ]
    },
    codeTitle: "Chấm điểm tự động bộ 20+ Test Cases JSONL bằng Azure AI Evaluation SDK",
    code: `import os
from azure.identity import DefaultAzureCredential
from azure.ai.evaluation import (
    evaluate,
    GroundednessEvaluator,
    RelevanceEvaluator,
    CoherenceEvaluator,
    FluencyEvaluator,
    ContentSafetyEvaluator,
    AzureOpenAIModelConfiguration
)

# 1. Cấu hình mô hình Giám khảo (LLM-as-a-Judge) và thông tin Foundry Project
judge_model = AzureOpenAIModelConfiguration(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_deployment="gpt-4o",
    api_version="2024-10-21"
)
foundry_project = os.environ["AZURE_AI_PROJECT_ENDPOINT"]
credential = DefaultAzureCredential()

# 2. Khởi tạo bộ giám khảo toàn diện: Chất lượng RAG + Ngôn ngữ + An toàn nội dung
evaluators = {
    "groundedness": GroundednessEvaluator(model_config=judge_model, credential=credential),
    "relevance": RelevanceEvaluator(model_config=judge_model, credential=credential),
    "coherence": CoherenceEvaluator(model_config=judge_model, credential=credential),
    "fluency": FluencyEvaluator(model_config=judge_model, credential=credential),
    "safety": ContentSafetyEvaluator(azure_ai_project=foundry_project, credential=credential)
}

# 3. Chạy đánh giá hàng loạt trên file 25 test cases chuẩn định dạng JSONL
result = evaluate(
    data="./tests/golden_rag_25_cases.jsonl",  # Mỗi dòng có: query, context, response, ground_truth
    evaluators=evaluators,
    azure_ai_project=foundry_project,          # Đẩy báo cáo trực quan lên cổng Microsoft Foundry
    output_path="./eval_results_v2.json"
)
print("Điểm trung bình toàn bộ tập test:", result["metrics"])`,
    codeNotes: [
      "Hàm `evaluate()` đọc trực tiếp file `.jsonl`, tự động ánh xạ các cột `query`, `context`, `response` vào từng Evaluator tương ứng và chạy song song nhiều luồng rất nhanh.",
      "Nên chọn một mô hình mạnh và ổn định (như `gpt-4o`) làm `judge_model` để chấm điểm đầu ra của các mô hình thực thi nhẹ hơn (như `gpt-4o-mini` hoặc `Phi-4`), đảm bảo độ khách quan cao.",
      "Truyền tham số `azure_ai_project` giúp lưu lại lịch sử từng lần chạy trên giao diện Microsoft Foundry Portal, cho phép em bấm vào từng dòng bị điểm 1–2 để soi tận mắt đoạn văn nào gây mất điểm."
    ],
    labGuide: {
      goal: "Tạo bộ Golden Dataset 20+ câu hỏi JSONL và chạy quy trình chấm điểm tự động để so sánh hai phiên bản System Prompt của Agent.",
      steps: [
        "Bước 1: Tạo file `golden_rag_25_cases.jsonl` gồm 25 dòng JSON đại diện cho đủ 4 nhóm kịch bản: 10 câu chuẩn, 7 câu hỏi ghép nhiều điều kiện, 4 câu ngoài phạm vi tài liệu và 4 câu gài bẫy Prompt Injection.",
        "Bước 2: Viết hàm chạy Agent với `Prompt_v1` (khá lỏng lẻo) và `Prompt_v2` (có ràng buộc Grounding nghiêm ngặt) trên cả 25 câu hỏi để xuất ra hai file kết quả chứa cột `response` và `context`.",
        "Bước 3: Chạy đoạn script `azure-ai-evaluation` cho cả hai phiên bản và mở đường link `studio_url` in trên màn hình console để xem biểu đồ đối sánh trên cổng Microsoft Foundry.",
        "Bước 4: Viết một câu điều kiện kiểm tra tự động cho CI/CD: nếu `result['metrics']['groundedness.groundedness'] < 4.0` thì `raise SystemExit(1)` để chặn phát hành phiên bản kém chất lượng."
      ],
      expectedOutput: "Bảng báo cáo hiển thị rõ điểm trung bình 1.0–5.0 của Groundedness, Relevance, Coherence, Fluency cùng tỷ lệ an toàn cho cả 25 test cases; `Prompt_v2` vượt ngưỡng Groundedness > 4.2 trong khi `Prompt_v1` bị chặn lại do tự bịa ở nhóm câu ngoài phạm vi."
    },
    examTips: [
      "Đề bài hỏi: 'Measure whether the model fabricates facts not present in the retrieved documents' -> Chọn ngay **GroundednessEvaluator** (nhớ yêu cầu đầu vào phải có cột `context` và `response`).",
      "Đề bài hỏi: 'Evaluate whether the generated answer directly addresses the user question' -> Chọn **RelevanceEvaluator**; hỏi về 'grammatical correctness and readability' -> Chọn **FluencyEvaluator**; hỏi về 'logical flow and organization of ideas' -> Chọn **CoherenceEvaluator**.",
      "Định dạng file dữ liệu chuẩn mặc định cho `azure-ai-evaluation` và đánh giá hàng loạt trên Microsoft Foundry là **JSONL (`.jsonl` - JSON Lines)**, không phải file Word hay PDF thô."
    ],
    summaryTakeaways: [
      "Không thể cải tiến thứ mà bạn không đo lường được: đánh giá định lượng bằng `azure-ai-evaluation` là bước bắt buộc trước khi đưa Agent lên Production hoặc đổi model/prompt.",
      "Nhớ rõ bản đồ ánh xạ chỉ số: Groundedness chống bịa đặt ngoài tài liệu; Relevance chống trả lời lạc đề; Coherence đo bố cục lô-gíc; Fluency đo ngữ pháp trôi chảy; Safety chặn nội dung độc hại.",
      "Bộ kiểm thử chuẩn (Golden Dataset) cần tối thiểu 20+ test cases ở định dạng `.jsonl`, phủ đều cả ca thông thường, ca biên khó, ca ngoài phạm vi và ca tấn công đối kháng.",
      "Tích hợp bước `evaluate()` làm cổng kiểm soát tự động (Quality Gate) trong CI/CD giúp phát hiện sớm lỗi hồi quy chất lượng (Prompt/Model Regression)."
    ],
    lessonQuestions: [
      {
        question: "Đội phát triển của bạn nâng cấp trợ lý RAG tra cứu quy trình bảo dưỡng máy bay. Sau khi đổi sang một mô hình nhỏ hơn để giảm chi phí, các kỹ sư phản ánh trợ lý viết câu văn tiếng Anh rất mượt mà và trả lời đúng trọng tâm câu hỏi, nhưng thỉnh thoảng lại tự đưa thêm thông số áp suất lốp không hề có trong tài liệu hướng dẫn kỹ thuật được truy xuất. Bộ đánh giá tự động nào giúp bạn đo lường chính xác lỗi này?",
        options: [
          "FluencyEvaluator",
          "GroundednessEvaluator",
          "CoherenceEvaluator",
          "BLEUScoreEvaluator không cần ngữ cảnh"
        ],
        answer: 1,
        explanation: "GroundednessEvaluator đối chiếu trực tiếp câu trả lời (`response`) với tài liệu được truy xuất (`context`) để phát hiện bất kỳ thông số hoặc khẳng định nào do mô hình tự bịa ra ngoài tài liệu gốc.",
        wrongReasons: [
          "FluencyEvaluator chỉ chấm ngữ pháp và độ trôi chảy ngôn ngữ, nên câu văn mượt mà bịa số liệu vẫn đạt điểm tối đa.",
          "",
          "CoherenceEvaluator chỉ đo mạch lô-gíc trình bày giữa các câu chứ không kiểm chứng tính xác thực dựa trên tài liệu nguồn.",
          "BLEU đo độ khớp chuỗi từ với một câu mẫu cố định chứ không đo mức độ bám sát ngữ cảnh truy xuất động."
        ]
      },
      {
        question: "Khi chuẩn bị bộ dữ liệu kiểm thử tự động (Evaluation Dataset) trên Microsoft Foundry để đánh giá định kỳ một Customer Support Agent trước mỗi bản phát hành, cách tiếp cận nào sau đây đảm bảo độ tin cậy thực chiến cao nhất?",
        options: [
          "Chỉ dùng 2 câu hỏi đơn giản nhất lưu trong file `.docx` để chạy cho nhanh.",
          "Xây dựng file `.jsonl` chứa tối thiểu 20+ test cases đa dạng bao gồm câu hỏi phổ biến, câu hỏi nhiều điều kiện, câu hỏi nằm ngoài phạm vi tài liệu và các câu gài bẫy an toàn.",
          "Chỉ chấm điểm Fluency và bỏ qua hoàn toàn kiểm tra Safety cũng như Groundedness.",
          "Chờ khách hàng phàn nàn trên mạng xã hội rồi mới kiểm tra thủ công từng câu."
        ],
        answer: 1,
        explanation: "Một tập Golden Dataset định dạng `.jsonl` với từ 20+ ca kiểm thử trở lên bao quát cả trường hợp chuẩn, trường hợp biên, ngoài phạm vi và đối kháng giúp phát hiện toàn diện lỗi hồi quy chất lượng trước khi ảnh hưởng tới người dùng thật.",
        wrongReasons: [
          "2 câu hỏi quá ít không có ý nghĩa thống kê và `.docx` không phải định dạng chuẩn cho batch evaluation.",
          "",
          "Bỏ qua Groundedness và Safety khiến hệ thống đối mặt rủi ro bịa đặt thông tin và phát ngôn độc hại nghiêm trọng.",
          "Kiểm tra bị động sau sự cố gây tổn hại uy tín doanh nghiệp và không thể tự động hóa trong CI/CD."
        ]
      }
    ]
  },

  "C1": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, bước sang Học phần C, thầy trò mình sẽ mở rộng giác quan cho hệ thống AI: từ chỗ chỉ biết đọc chữ thuần túy sang khả năng 'nhìn ảnh, hiểu cảnh, đọc biển báo và gác cổng an toàn hình ảnh'. Trong thực tế sản xuất, bán lẻ hay bảo hiểm xe cơ giới, dữ liệu đổ về mỗi ngày là hàng trăm nghìn bức ảnh chụp kệ siêu thị, ảnh hiện trường va chạm giao thông hay ảnh người dùng tải lên mạng xã hội. Đề thi AI-103 rất hay đặt câu hỏi buộc em phải cân nhắc khéo léo giữa hai con đường: khi nào dùng API chuyên dụng tốc độ cao chi phí rẻ của **Azure AI Vision (Image Analysis 4.0)**, khi nào cần khả năng suy luận đa phương thức sâu sắc của **Multimodal LLM (như GPT-4o)**, và phân biệt rạch ròi giữa **Caption, Dense Captions và Object Detection**!",
    analogy: {
      title: "Chuyên viên kiểm kho tốc độ cao và Vị thám tử suy luận hiện trường",
      body: "Em hãy hình dung việc xử lý hình ảnh trong Azure giống như có hai nhân sự khác nhau. **Azure AI Vision Image Analysis** giống một chuyên viên kiểm kho cực kỳ nhanh nhẹn: nhìn lướt qua bức ảnh trong 100 mili-giây là khoanh vùng tọa độ chính xác từng chiếc mũ bảo hiểm (`Object Detection`), đọc câu mô tả tổng thể (`Caption`) hoặc mô tả từng góc nhỏ trong ảnh (`Dense Captions`) với chi phí tính bằng vài xu lẻ cho cả nghìn tấm ảnh. Còn **Multimodal LLM (như GPT-4o)** giống một vị thám tử lão luyện: không chỉ thấy trong ảnh có vết móp đầu xe và vạch kẻ đường, mà còn suy luận được mối liên hệ phức tạp 'Xe màu trắng đã lấn làn qua vạch liền gây va chạm góc 45 độ, đối chiếu với quy tắc bảo hiểm trang 4 thì thuộc nhóm lỗi hỗn hợp'."
    },
    objectives: [
      "Phân biệt chính xác đầu ra và trường hợp sử dụng của Image Captioning, Dense Captions, Object Detection, Smart Cropping và OCR Read trong Azure AI Vision 4.0.",
      "Lựa chọn đúng kiến trúc giữa Azure AI Vision API chuyên biệt và Multimodal LLM (GPT-4o / GPT-4o-mini) dựa trên bài toán tọa độ khung hình, độ trễ và chi phí.",
      "Tích hợp lớp kiểm duyệt an toàn thị giác (Visual Safety với Azure AI Content Safety) để chặn hình ảnh nhạy cảm trước khi xử lý hoặc hiển thị."
    ],
    flow: [
      {
        step: "1. Image Ingestion & Pre-validation (Tiếp nhận và Kiểm tra định dạng ảnh)",
        detail: "Ứng dụng kiểm tra định dạng hợp lệ (JPEG/PNG/WEBP), giới hạn kích thước tệp/độ phân giải rồi truyền luồng byte hoặc Blob URL bảo mật sang dịch vụ."
      },
      {
        step: "2. Visual Safety Screening (Sàng lọc an toàn nội dung ảnh)",
        detail: "Gọi Azure AI Content Safety (`AnalyzeImage`) chấm mức độ nghiêm trọng (0, 2, 4, 6) trên 4 danh mục Hate, SelfHarm, Sexual, Violence trước khi lưu trữ công khai."
      },
      {
        step: "3. Feature Extraction via Vision 4.0 (Trích xuất đặc trưng thị giác có cấu trúc)",
        detail: "Gọi `ImageAnalysisClient` với danh sách `VisualFeatures` cần thiết để nhận về nhãn đối tượng, khung bao tọa độ pixel (`bounding_box`) kèm điểm tự tin (`confidence`)."
      },
      {
        step: "4. Multimodal Reasoning - Optional (Suy luận ngữ cảnh sâu đa phương thức)",
        detail: "Với các ảnh đòi hỏi giải thích nguyên nhân, đọc biểu đồ phức tạp hoặc trả lời câu hỏi mở kết hợp quy trình nghiệp vụ, gửi ảnh tới mô hình đa phương thức trên Microsoft Foundry."
      }
    ],
    sections: [
      {
        heading: "1. Giải mã bộ ba hay gây nhầm lẫn nhất đề thi: Caption vs Dense Captions vs Object Detection",
        paragraphs: [
          "Khi mở SDK `azure-ai-vision-imageanalysis`, em sẽ thấy rất nhiều cờ trong `VisualFeatures`. Trong phòng thi AI-103, 80% thí sinh mất điểm oan ở câu hỏi phân biệt **CAPTION**, **DENSE_CAPTIONS** và **OBJECTS** vì cả ba đều 'nhận diện cái gì có trong ảnh'. Thầy sẽ chỉ cho em điểm khác biệt cốt lõi nằm ở **số lượng vùng, câu văn tự nhiên hay nhãn đơn lẻ, và có tọa độ Bounding Box hay không**!",
          "Hãy lấy ví dụ bức ảnh chụp một gia đình đang dã ngoại trong công viên: **CAPTION** chỉ trả về **duy nhất 1 câu văn tự nhiên** mô tả toàn cảnh bức ảnh (ví dụ: `'Một gia đình đang ngồi ăn trưa trên thảm cỏ xanh'`) và KHÔNG chia nhỏ từng góc. Ngược lại, **DENSE_CAPTIONS** sinh ra **tối đa tới 10 câu văn mô tả chi tiết cho từng vùng nổi bật khác nhau** trong bức ảnh VÀ mỗi câu đều đi kèm tọa độ khung chữ nhật **`bounding_box` `{x, y, w, h}`** (ví dụ vùng 1: `'Một bé gái mặc áo vàng đang cầm quả bóng'`, vùng 2: `'Chiếc giỏ mây đựng trái cây trên thảm'`). Còn **OBJECTS (Object Detection)** thì KHÔNG viết câu văn dài mà chỉ trả về **nhãn danh từ của vật thể** (`person`, `dog`, `bicycle`) kèm tọa độ `bounding_box` để em đếm số lượng hoặc vẽ khung khoanh vùng!"
        ],
        bullets: [
          "**`VisualFeatures.CAPTION`**: 1 câu mô tả tổng quát cho toàn bức ảnh -> Hợp nhất để sinh thuộc tính `alt-text` hỗ trợ người khiếm thị đọc web cơ bản.",
          "**`VisualFeatures.DENSE_CAPTIONS`**: Nhiều câu mô tả chi tiết cho tối đa 10 vùng con + kèm `bounding_box` cho từng vùng -> Hợp nhất khi cần vừa biết tọa độ vừa cần câu mô tả hành động/màu sắc của từng cụm chi tiết.",
          "**`VisualFeatures.OBJECTS`**: Danh sách tên vật thể ngắn gọn + `bounding_box` + `confidence` -> Hợp nhất để đếm số sản phẩm trên kệ hàng, phát hiện người không đội mũ bảo hộ.",
          "**Lưu ý vùng địa lý (Region Availability)**: Tính năng `CAPTION` và `DENSE_CAPTIONS` sử dụng mô hình Florence nền tảng nên chỉ hỗ trợ ở một số Region nhất định trên Azure và có giới hạn ngôn ngữ hỗ trợ (chủ yếu mạnh nhất ở tiếng Anh — kiểm tra bảng ngôn ngữ khi đề thi hỏi đa quốc gia!)."
        ]
      },
      {
        heading: "2. Khi nào chọn Azure AI Vision API, khi nào chọn Multimodal Models (GPT-4o)?",
        paragraphs: [
          "Ngày nay khi GPT-4o và GPT-4o-mini đã nhìn ảnh rất giỏi, nhiều bạn hỏi thầy: *'Vậy mình vứt luôn Azure AI Vision đi, cái gì cũng nhét ảnh vào GPT-4o cho nhàn được không thầy?'*. Câu trả lời thực chiến là **Không!** Mỗi công cụ sinh ra cho một bài toán kinh tế – kỹ thuật khác nhau.",
          "Nếu dây chuyền nhà máy chụp 50 bức ảnh mỗi giây để lấy tọa độ pixel chính xác `(x, y, width, height)` của từng chai nước bị lệch nắp nhằm điều khiển cánh tay robot gạt ra, **Azure AI Vision (hoặc Custom Vision cho vật thể đặc thù riêng của nhà máy)** thắng tuyệt đối nhờ độ trễ cực thấp, trả về tọa độ hình học chuẩn xác và chi phí rẻ hơn rất nhiều ở quy mô lớn. Ngược lại, nếu khách hàng chụp ảnh bảng điều khiển máy giặt đang nhấp nháy 3 đèn báo lỗi kèm tờ hướng dẫn sử dụng nhàu nát rồi hỏi: *'Máy nhà tôi báo đèn thế này thì tôi nên vặn núm nào tiếp theo?'*, chỉ có **Multimodal LLM** mới đủ khả năng kết nối tri thức thị giác với suy luận nhiều bước để hướng dẫn từng thao tác."
        ],
        bullets: [
          "Chọn **Azure AI Vision Image Analysis**: Cần tọa độ `bounding_box` pixel chuẩn, cắt ảnh thông minh giữ chủ thể (`SMART_CROPS` làm ảnh thumbnail), gán thẻ tìm kiếm hàng triệu ảnh (`TAGS`) với chi phí tối ưu.",
          "Chọn **Azure AI Custom Vision**: Khi cần huấn luyện nhận diện hoặc phân loại mã linh kiện/vết nứt độc quyền của riêng nhà máy chỉ với vài chục bức ảnh mẫu có gán nhãn.",
          "Chọn **Multimodal Models trên Foundry (`gpt-4o`)**: Khi cần đọc hiểu biểu đồ kinh doanh phức tạp, suy luận nguyên nhân – kết quả từ hình ảnh hoặc hỏi đáp hội thoại tự do xoay quanh bức ảnh."
        ]
      },
      {
        heading: "3. Visual Safety: Chốt chặn kiểm duyệt hình ảnh cho nền tảng người dùng",
        paragraphs: [
          "Bất kỳ ứng dụng nào cho phép người dùng tải ảnh đại diện, ảnh đánh giá sản phẩm hoặc gửi ảnh cho Agent xử lý đều đối mặt nguy cơ bị tải lên hình ảnh bạo lực máu me, khiêu dâm hoặc biểu tượng thù ghét. Ngoài bộ cờ cơ bản trước đây, chuẩn hiện đại nhất trong hệ sinh thái Microsoft (và trọng tâm đề thi AI-103) là sử dụng dịch vụ **Azure AI Content Safety** (API `AnalyzeImage` hoặc Multimodal Content Safety kiểm tra cả chữ chèn trên ảnh meme).",
          "Dịch vụ này chấm điểm độc lập cho từng bức ảnh trên 4 trục rủi ro (**Hate, SelfHarm, Sexual, Violence**) với các mức độ nghiêm trọng chẵn `0` (An toàn), `2` (Thấp), `4` (Trung bình), `6` (Cao). Nhờ đó, một nền tảng trò chơi cho trẻ em có thể đặt ngưỡng chặn cực gắt (chặn ngay từ mức `>= 2`), trong khi hệ thống lưu trữ hồ sơ y khoa pháp y của bệnh viện có thể cấu hình ngưỡng riêng cho danh mục thương tích y tế mà vẫn chặn tuyệt đối các danh mục độc hại khác."
        ],
        bullets: [
          "Luôn chạy kiểm tra Visual Safety ở bước tiền xử lý (trước khi lưu công khai ra CDN hoặc trước khi đưa ảnh của người lạ vào kho tri thức chung).",
          "Sử dụng kết hợp kiểm tra chữ viết ẩn trong ảnh (OCR / Multimodal) để bắt các ảnh chụp màn hình chứa lời lẽ kích động hoặc tấn công Prompt Injection bằng hình ảnh!",
          "Tuân thủ nguyên tắc Responsible AI đối với dữ liệu khuôn mặt: các tính năng nhận diện định danh khuôn mặt nhạy cảm bị giới hạn quyền truy cập (Limited Access) nhằm bảo vệ quyền riêng tư."
        ]
      }
    ],
    comparison: {
      title: "Bảng phân biệt các công cụ Thị giác máy tính chuẩn đề thi AI-103",
      headers: ["Tính năng / Dịch vụ", "Đầu ra chính", "Khi nào chọn (Đề thi)", "Giới hạn / Lưu ý"],
      rows: [
        [
          "Image Captioning (`CAPTION`)",
          "1 câu văn mô tả tổng thể + điểm `confidence`",
          "Tự động tạo `alt-text` ngắn gọn cho toàn bộ bức ảnh hỗ trợ khả năng tiếp cận (Accessibility)",
          "Không trả về tọa độ khung vùng từng vật thể riêng lẻ"
        ],
        [
          "Dense Captions (`DENSE_CAPTIONS`)",
          "Tối đa 10 câu mô tả cho các vùng con + `bounding_box` từng vùng",
          "Cần mô tả chi tiết nhiều hoạt động/cụm chi tiết khác nhau xuất hiện trong cùng một bức ảnh lớn",
          "Chỉ khả dụng ở các Azure Region được hỗ trợ và tập ngôn ngữ giới hạn"
        ],
        [
          "Object Detection (`OBJECTS`)",
          "Danh sách nhãn vật thể + tọa độ `bounding_box` `{x,y,w,h}`",
          "Đếm số lượng vật thể phổ thông và vẽ khung định vị vị trí vật thể trên ảnh",
          "Nếu vật thể là mã sản phẩm nội bộ đặc thù chưa có sẵn, cần huấn luyện trên Custom Vision"
        ],
        [
          "Multimodal LLM (`gpt-4o`) + Content Safety",
          "Câu trả lời suy luận tự nhiên / JSON + Điểm an toàn mức 0–6",
          "Hỏi đáp suy luận sâu từ hình ảnh/biểu đồ phức tạp và kiểm duyệt ảnh độc hại do người dùng tải lên",
          "GPT-4o không phải công cụ chuyên đo tọa độ pixel chính xác như Object Detection"
        ]
      ]
    },
    codeTitle: "Phân tích Dense Captions, Object Detection và Kiểm duyệt an toàn ảnh trên Azure",
    code: `import os
from azure.identity import DefaultAzureCredential
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.ai.contentsafety import ContentSafetyClient
from azure.ai.contentsafety.models import AnalyzeImageOptions, ImageData

credential = DefaultAzureCredential()

# 1. Kiểm tra Visual Safety trước khi xử lý ảnh do người dùng tải lên
safety_client = ContentSafetyClient(os.environ["CONTENT_SAFETY_ENDPOINT"], credential)
with open("warehouse_scene.jpg", "rb") as f:
    img_bytes = f.read()

safety_res = safety_client.analyze_image(AnalyzeImageOptions(image=ImageData(content=img_bytes)))
if any(cat.severity >= 2 for cat in safety_res.categories_analysis):
    raise ValueError("Ảnh vi phạm tiêu chuẩn an toàn nội dung, từ chối xử lý!")

# 2. Trích xuất đồng thời Caption, Dense Captions và Object Detection chỉ trong 1 lần gọi API
vision_client = ImageAnalysisClient(os.environ["VISION_ENDPOINT"], credential)
result = vision_client.analyze(
    image_data=img_bytes,
    visual_features=[
        VisualFeatures.CAPTION,
        VisualFeatures.DENSE_CAPTIONS,
        VisualFeatures.OBJECTS
    ],
    gender_neutral_caption=True  # Tuân thủ Responsible AI: dùng từ trung lập giới tính ('person' thay vì đoán 'man/woman')
)

print("Mô tả toàn cảnh:", result.caption.text)
for dc in result.dense_captions.list[:3]:
    print(f"Vùng {dc.bounding_box}: '{dc.text}' (Độ tin cậy: {dc.confidence:.2f})")`,
    codeNotes: [
      "Tham số `gender_neutral_caption=True` là một chi tiết cực kỳ ăn điểm về **Responsible AI** trong đề thi Microsoft: thay vì suy đoán giới tính qua ngoại hình dễ gây định kiến sai lệch (như `'a businessman'`), mô hình sẽ dùng danh từ trung lập chuẩn xác (`'a person wearing a suit'`).",
      "SDK `azure-ai-vision-imageanalysis` cho phép gộp nhiều `VisualFeatures` trong một mảng duy nhất để lấy cả Caption, Dense Captions, Objects và Read trong một vòng mạng.",
      "Bước kiểm tra `safety_client.analyze_image(...)` đặt ngay đầu phễu đảm bảo ảnh độc hại (mức `severity >= 2`) bị chặn sớm trước khi đi sâu vào quy trình nghiệp vụ."
    ],
    labGuide: {
      goal: "Thực hành trích xuất Dense Captions kèm tọa độ Bounding Box và đối chiếu sự khác biệt với Object Detection trên ảnh chụp thực tế.",
      steps: [
        "Bước 1: Khởi tạo tài nguyên Azure AI Services đa dịch vụ (hoặc Azure AI Vision + Content Safety) tại Region hỗ trợ Florence 4.0 (như `eastus` hoặc `westus2`), cấp quyền `Cognitive Services User`.",
        "Bước 2: Chọn 1 bức ảnh chụp góc bàn làm việc có laptop, cốc cà phê và cuốn sổ tay; chạy đoạn code mẫu và in toàn bộ danh sách `dense_captions` cùng `objects`.",
        "Bước 3: Dùng thư viện `Pillow (PIL.ImageDraw)` vẽ các khung hình chữ nhật từ tọa độ `(x, y, x + width, y + height)` của `dense_captions` màu xanh lá và `objects` màu đỏ lên ảnh để trực quan hóa sự khác nhau.",
        "Bước 4: Thử bật/tắt cờ `gender_neutral_caption=True` trên một bức ảnh có người đang thuyết trình để quan sát câu mô tả thay đổi sang ngôn từ trung lập ra sao."
      ],
      expectedOutput: "Ảnh đầu ra hiển thị rõ khung tọa độ chuẩn quanh từng cụm vật thể; `caption` trả về 1 câu tổng quát trung lập giới tính, còn `dense_captions` liệt kê từng câu mô tả riêng cho vùng chiếc laptop, cốc cà phê kèm điểm `confidence`."
    },
    examTips: [
      "Từ khóa đề bài 'generate human-readable descriptions for multiple distinct regions within a single image along with bounding box coordinates' -> Chọn ngay **Dense Captions**.",
      "Từ khóa đề bài 'avoid assuming gender in generated image alt-text for Responsible AI compliance' -> Bật tham số **`gender_neutral_caption=True`**.",
      "Từ khóa đề bài 'create square thumbnails for mobile/desktop without cutting off the main subject of the photo' -> Chọn tính năng **Smart Cropping (`VisualFeatures.SMART_CROPS`)**."
    ],
    summaryTakeaways: [
      "Caption tạo 1 câu mô tả toàn cảnh; Dense Captions tạo tới 10 câu mô tả kèm khung tọa độ cho từng vùng con; Object Detection định vị tọa độ và nhãn vật thể.",
      "Kết hợp linh hoạt Azure AI Vision (mạnh về tọa độ hình học, tốc độ cao, chi phí thấp) với Multimodal LLM như GPT-4o (mạnh về suy luận ngữ cảnh mở và đọc hiểu biểu đồ phức tạp).",
      "Luôn tích hợp Azure AI Content Safety để chấm mức độ rủi ro hình ảnh (0–6) cho mọi luồng dữ liệu ảnh do người dùng bên ngoài tải lên.",
      "Bật `gender_neutral_caption=True` và lưu ý giới hạn vùng địa lý (Region) khi triển khai các tính năng sinh mô tả ảnh."
    ],
    lessonQuestions: [
      {
        question: "Một sàn thương mại điện tử nội thất muốn tự động phân tích mỗi bức ảnh phòng khách mẫu để vừa lấy được tọa độ khung chữ nhật của từng cụm góc trang trí nổi bật, vừa sinh sẵn một câu mô tả tự nhiên hoàn chỉnh cho riêng từng góc đó (ví dụ: 'Một chiếc ghế sofa vải xám đặt cạnh bàn trà gỗ tròn'). Tính năng nào của Azure AI Vision đáp ứng trực tiếp yêu cầu này trong một lần gọi?",
        options: [
          "Dense Captions (`VisualFeatures.DENSE_CAPTIONS`)",
          "Image Captioning (`VisualFeatures.CAPTION`)",
          "Image Tagging (`VisualFeatures.TAGS`)",
          "Smart Cropping (`VisualFeatures.SMART_CROPS`)"
        ],
        answer: 0,
        explanation: "Dense Captions là tính năng duy nhất kết hợp cả hai yếu tố: định vị nhiều vùng đáng chú ý trong một bức ảnh bằng tọa độ `bounding_box` VÀ sinh câu mô tả ngôn ngữ tự nhiên hoàn chỉnh cho từng vùng đó.",
        wrongReasons: [
          "",
          "Image Captioning chỉ sinh duy nhất 1 câu cho toàn bộ bức ảnh và không tách từng góc kèm tọa độ riêng.",
          "Image Tagging chỉ trả về danh sách từ khóa đơn lẻ cho cả bức ảnh mà không có tọa độ hay câu văn mô tả.",
          "Smart Cropping chỉ gợi ý khung cắt ảnh thu nhỏ giữ chủ thể, không sinh văn bản mô tả."
        ]
      },
      {
        question: "Ứng dụng diễn đàn cộng đồng của bạn cho phép người dùng đăng ảnh chụp công khai. Ban quản trị yêu cầu hệ thống phải tự động chặn các bức ảnh có nội dung bạo lực từ mức trung bình trở lên nhưng vẫn cho phép các bức ảnh thể thao đối kháng nhẹ nhàng đi qua. Giải pháp nào phù hợp nhất?",
        options: [
          "Chỉ kiểm tra phần mở rộng tên tệp tin xem có phải đuôi `.jpg` hay không.",
          "Sử dụng Azure AI Content Safety Image Analysis và cấu hình ngưỡng chặn dựa trên điểm mức độ nghiêm trọng (`severity` từ 4 trở lên) của danh mục `Violence`.",
          "Dùng tính năng OCR Read để xóa hết chữ trên bức ảnh.",
          "Nén độ phân giải bức ảnh xuống 32x32 pixel."
        ],
        answer: 1,
        explanation: "Azure AI Content Safety phân tích hình ảnh theo 4 danh mục độc hại kèm thang điểm mức độ nghiêm trọng (0, 2, 4, 6), cho phép doanh nghiệp tinh chỉnh chính xác ngưỡng chặn (ví dụ chặn từ mức trung bình 4 trở lên ở danh mục Violence).",
        wrongReasons: [
          "Đuôi tệp `.jpg` không phản ánh bất kỳ điều gì về nội dung hình ảnh bên trong.",
          "",
          "OCR chỉ đọc chữ viết chứ không phát hiện được cảnh bạo lực bằng hình ảnh.",
          "Giảm độ phân giải làm hỏng trải nghiệm người dùng mà không kiểm duyệt được nội dung vi phạm."
        ]
      }
    ]
  },

  "C2": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, nếu ở bài C1 AI đóng vai người quan sát thấu hiểu bức ảnh có sẵn, thì sang bài C2 hôm nay, AI sẽ cầm cọ trở thành nhà thiết kế đồ họa và chuyên gia phân tích băng ghi hình! Các tập đoàn quảng cáo, bán lẻ hiện nay dùng mô hình tạo ảnh trên Microsoft Foundry để dựng hàng trăm bối cảnh trưng bày sản phẩm mới trong vài phút, đồng thời dùng AI bóc tách nội dung từ hàng nghìn giờ video đào tạo hoặc giám sát cửa hàng. Khi bước vào phòng thi AI-103, thầy muốn em nắm thật chắc 4 trụ cột: cách viết prompt sinh ảnh chuẩn xác (Text-to-Image), sửa một vùng ảnh chọn lọc bằng mặt nạ (**Inpainting / Edits**), kiến trúc hiểu nội dung **Video**, và đặc biệt là cơ chế bảo vệ bản quyền nguồn gốc số (**Content Provenance / C2PA**)!",
    analogy: {
      title: "Họa sĩ vẽ phông nền theo băng keo che sơn và Con dấu nổi chống giả của xưởng tranh",
      body: "Em hãy hình dung tính năng **Inpainting (Image Edit)** giống như khi em muốn sơn đổi màu đúng một bức tường trong phòng mà không làm lem sơn vào chiếc tivi treo giữa tường: em lấy băng keo dán che kín chiếc tivi giữ nguyên, chỉ cạo lớp vôi ở vùng cần vẽ lại (vùng trong suốt trên ảnh Mask) rồi dặn họa sĩ vẽ kệ sách gỗ vào đúng chỗ trống đó! Còn **Content Provenance (C2PA)** giống như con dấu nổi mật mã đóng chìm vào khung tranh ngay lúc xuất xưởng — bất kỳ tòa soạn báo hay trình duyệt nào soi vào cũng biết ngay bức ảnh này do AI tạo ra vào ngày giờ nào, không ai có thể mạo danh đó là ảnh chụp thời sự thật!"
    },
    objectives: [
      "Sử dụng thành thạo các mô hình tạo và chỉnh sửa ảnh trên Microsoft Foundry (`gpt-image-1`, `DALL-E 3`) bao gồm kiểm soát kích thước, phong cách và vùng chỉnh sửa Inpainting.",
      "Hiểu rõ kiến trúc phân tích hiểu nội dung Video (Azure AI Content Understanding / Azure AI Video Indexer / Multimodal Frame Sampling).",
      "Nắm vững cơ chế lọc nội dung kép (Prompt Shields / Content Filters) và xác thực nguồn gốc ảnh sinh bởi AI theo chuẩn C2PA Content Credentials."
    ],
    flow: [
      {
        step: "1. Input Prompt Safety & Revision (Kiểm duyệt và Tinh chỉnh câu lệnh mô tả)",
        detail: "Hệ thống kiểm tra prompt văn bản chống nội dung cấm (bạo lực, người nổi tiếng nhạy cảm, bản quyền thương hiệu) và chuẩn hóa mô tả chi tiết về ánh sáng, góc máy, bố cục."
      },
      {
        step: "2. Synthesis or Masked Inpainting (Sinh ảnh mới hoặc Chỉnh sửa theo vùng Mask)",
        detail: "Mô hình khuếch tán/đa phương thức tạo ảnh mới từ văn bản, hoặc chỉ tái tạo lại vùng điểm ảnh được đánh dấu bằng mặt nạ kênh Alpha (Inpainting)."
      },
      {
        step: "3. Output Filtering & C2PA Signing (Kiểm duyệt đầu ra & Đóng dấu nguồn gốc)",
        detail: "Ảnh sinh ra được quét lại bằng bộ lọc an toàn thị giác và đính kèm siêu dữ liệu mật mã chuẩn C2PA (Content Credentials) chứng nhận nguồn gốc do AI tạo."
      },
      {
        step: "4. Video Multimodal Understanding (Phân tích đa phương thức đối với Video)",
        detail: "Đối với luồng video, hệ thống tách đồng bộ khung hình chính (keyframes) + lời thoại âm thanh (transcript) để trích xuất phân cảnh, nhân vật, chủ đề và tóm tắt có mốc thời gian (`timestamps`)."
      }
    ],
    sections: [
      {
        heading: "1. Text-to-Image và kỹ thuật Inpainting / Image Edits trong thực tế Marketing",
        paragraphs: [
          "Trên Microsoft Foundry / Azure OpenAI, khi gọi API tạo ảnh từ văn bản (`client.images.generate`), chất lượng bức ảnh phụ thuộc rất lớn vào tính cụ thể của mô tả: **Chủ thể chính + Bối cảnh môi trường + Ánh sáng/Màu sắc + Phong cách nghệ thuật/Ống kính máy ảnh** (ví dụ: `'Ảnh chụp studio sản phẩm chai nước hoa thủy tinh đặt trên phiến đá cẩm thạch ướt, ánh sáng nắng chiều ấm áp chiếu xiên, độ sâu trường ảnh mỏng 85mm'`). Lưu ý nhỏ cực hay thi với `dall-e-3`: mặc định mô hình sẽ tự động viết lại prompt của em cho dài và giàu chi tiết hơn (trả về trong trường `revised_prompt`); nếu muốn ép mô hình bám sát từng từ gốc của mình hơn, em cần ghi chú rõ trong chỉ thị.",
          "Trong khi đó, bài toán thương mại phổ biến hơn cả vẽ mới từ con số 0 là **Inpainting (Chỉnh sửa vùng chọn qua `images.edit`)**. Giả sử khách hàng đã có bức ảnh chụp chiếc bàn ăn thật của công ty, nay dịp Giáng sinh muốn thay bình hoa sen trên bàn thành cây thông mini mà giữ nguyên 100% vân gỗ chiếc bàn thật. Lúc này em truyền vào **ảnh gốc** kèm một **ảnh mặt nạ (Mask PNG có kênh trong suốt Alpha)** — vùng nào trong suốt (hoặc được chỉ định chỉnh sửa) thì AI sẽ vẽ mới theo prompt dựa trên ánh sáng xung quanh, còn vùng được che giữ nguyên tuyệt đối từng pixel!"
        ],
        bullets: [
          "Kiểm soát các tham số chuẩn của API tạo ảnh: kích thước khung hình (`size`: vuông `1024x1024`, ngang `1792x1024` / `1536x1024`, dọc `1024x1792` / `1024x1536`), mức chất lượng (`quality`: `standard` / `hd` hoặc `high`).",
          "Với `dall-e-3`, tham số `style='natural'` tạo ảnh chân thực tự nhiên giống ảnh chụp hơn, trong khi `style='vivid'` tạo màu sắc rực rỡ, kịch tính đậm chất điện ảnh.",
          "URL tạm thời trả về từ API tạo ảnh thường tự hết hạn sau **60 phút** vì lý do bảo mật; nếu ứng dụng cần dùng lâu dài, bắt buộc phải tải luồng byte (hoặc nhận định dạng `b64_json`) lưu vào **Azure Blob Storage** của riêng mình!"
        ]
      },
      {
        heading: "2. Video Content Understanding: Làm sao để AI 'xem và hiểu' cả một cuốn băng dài?",
        paragraphs: [
          "Video không chỉ là một bức ảnh tĩnh — nó là chuỗi hàng chục nghìn khung hình nối tiếp nhau cộng với lời nói, tiếng động, chữ chạy trên màn hình và sự chuyển cảnh theo thời gian. Nếu em lấy nguyên file video MP4 nặng 2 GB nhồi thẳng vào một request chat thông thường thì không hệ thống nào chịu nổi. Trong hệ sinh thái Azure AI (và đề thi AI-103), có hai hướng tiếp cận chính để giải quyết bài toán **Video Content Understanding** tùy độ phức tạp:",
          "Hướng thứ nhất là sử dụng dịch vụ chuyên biệt như **Azure AI Content Understanding** (hoặc **Azure AI Video Indexer**): dịch vụ tự động bóc tách đa kênh cùng lúc — vừa chuyển lời nói thành văn bản có dấu thời gian, vừa nhận diện chữ viết xuất hiện trên bảng trình chiếu (OCR), phát hiện điểm chuyển cảnh (shot/scene detection), trích xuất khung hình đại diện (keyframes) và đổ dữ liệu có cấu trúc theo đúng schema nghiệp vụ để nạp thẳng vào kho RAG! Hướng thứ hai cho các đoạn clip ngắn đặc thù là tự trích xuất các khung hình theo nhịp (ví dụ mỗi 2 giây lấy 1 frame bằng OpenCV/FFmpeg) kết hợp bản gỡ băng âm thanh rồi gửi chuỗi ảnh + chữ đó vào mô hình đa phương thức `gpt-4o` để hỏi đáp."
        ],
        bullets: [
          "**Azure AI Content Understanding**: Mạnh mẽ khi cần biến tài liệu đa phương thức (Video, Audio, Ảnh, PDF) thành JSON có cấu trúc chuẩn hóa theo khuôn mẫu định trước của doanh nghiệp.",
          "**Azure AI Video Indexer**: Tối ưu cho kho lưu trữ truyền thông lớn cần tìm kiếm khoảnh khắc chính xác trong video theo từ khóa nói ra, vật thể xuất hiện, chủ đề và tạo phụ đề đa ngôn ngữ.",
          "Khi đánh chỉ mục video cho hệ thống RAG, mỗi chunk phải lưu kèm `start_time` và `end_time` (ví dụ `00:14:20 - 00:15:05`) để khi người dùng bấm vào trích dẫn, trình phát video nhảy đúng tới giây đó!"
        ]
      },
      {
        heading: "3. Content Filters & Provenance (C2PA): Đạo đức và Pháp lý cho nội dung sinh tạo",
        paragraphs: [
          "Sức mạnh tạo ảnh chân thực đi kèm trách nhiệm khổng lồ chống tin giả (Deepfake) và xâm phạm bản quyền. Trên Microsoft Foundry, mọi yêu cầu sinh ảnh đều đi qua **hai tầng lọc an toàn bắt buộc**: tầng 1 lọc văn bản đầu vào (chặn yêu cầu vẽ người thật mang tính bôi nhọ, bạo lực, lạm dụng trẻ em hoặc cố tình sao chép nhân vật có bản quyền), và tầng 2 quét chính bức ảnh vừa vẽ xong trước khi trả về cho ứng dụng.",
          "Đặc biệt, một khái niệm cực kỳ quan trọng trong bộ tiêu chuẩn Responsible AI của Microsoft mà đề thi rất hay hỏi là **Content Provenance (Truy xuất nguồn gốc nội dung) thông qua chuẩn C2PA (Coalition for Content Provenance and Authenticity)**. Mỗi bức ảnh sinh ra từ các mô hình tạo ảnh trên Azure đều được tự động gắn kèm một bản kê khai mật mã số (**Content Credentials** ký bằng chứng thư số của Microsoft). Nhờ vậy, các hệ thống kiểm chứng có thể xác minh tính toàn vẹn và nguồn gốc rằng bức ảnh này được tạo bởi AI chứ không phải ảnh chụp sự kiện có thật."
        ],
        bullets: [
          "**C2PA Content Credentials**: Siêu dữ liệu mật mã chống giả mạo đính kèm trong file ảnh ghi rõ công cụ AI tạo ảnh và thời điểm phát hành.",
          "Lưu ý kỹ thuật khi xử lý hậu kỳ: Nếu ứng dụng của em dùng thư viện nén ảnh làm xóa sạch toàn bộ header metadata của file PNG/JPEG, chữ ký C2PA gắn kèm có thể bị bong mất — cần lưu giữ bản gốc hoặc bảo toàn manifest khi phân phối.",
          "Luôn bắt ngoại lệ `BadRequestError` với mã lỗi `content_policy_violation` trong code Python để hiển thị thông báo hướng dẫn người dùng điều chỉnh lại mô tả lịch sự thay vì làm treo giao diện."
        ]
      }
    ],
    comparison: {
      title: "Bảng chọn giải pháp Tạo ảnh & Hiểu nội dung Video chuẩn đề thi AI-103",
      headers: ["Kịch bản nghiệp vụ", "Giải pháp / API trên Azure", "Cơ chế chính", "Lưu ý quan trọng khi đi thi"],
      rows: [
        [
          "Tạo ảnh minh họa mới hoàn toàn từ mô tả văn bản",
          "Foundry Image Generation (`gpt-image-1` / `dall-e-3`)",
          "Sinh ảnh từ Text Prompt kèm kiểm duyệt kép và đóng dấu C2PA",
          "URL ảnh trả về mặc định hết hạn sau 60 phút; cần lưu sang Blob Storage nếu dùng lâu dài"
        ],
        [
          "Thay đổi nền hoặc sửa một chi tiết nhỏ mà giữ nguyên sản phẩm thật",
          "Image Edits / Inpainting (`client.images.edit` + Mask)",
          "Dùng ảnh gốc + mặt nạ vùng chỉnh sửa (transparent mask) + prompt mô tả vùng mới",
          "Ảnh Mask cần đúng kích thước và đánh dấu rõ vùng kênh Alpha cần vẽ lại"
        ],
        [
          "Bóc tách dữ liệu có cấu trúc từ kho Video, Audio, biểu mẫu hỗn hợp",
          "Azure AI Content Understanding",
          "Phân tích đồng thời hình ảnh khung hình + lời thoại âm thanh xuất ra schema tùy chỉnh",
          "Rất phù hợp để xây dựng pipeline nạp dữ liệu đa phương thức (Multimodal RAG)"
        ],
        [
          "Tìm kiếm khoảnh khắc, tạo phụ đề và phân cảnh cho thư viện Video đào tạo lớn",
          "Azure AI Video Indexer",
          "Kết hợp Speech-to-Text, OCR trên màn hình, nhận diện cảnh và chủ đề theo mốc thời gian",
          "Trả về timeline chi tiết (`insights.json`) giúp nhảy thẳng tới đúng giây trong video"
        ]
      ]
    },
    codeTitle: "Sinh ảnh an toàn, Chỉnh sửa vùng chọn Inpainting và bắt lỗi Content Filter",
    code: `import base64, os
from openai import AzureOpenAI, BadRequestError
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=get_bearer_token_provider(
        DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
    ),
    api_version="2025-04-01-preview"
)

def generate_marketing_banner(prompt_text: str, output_file: str) -> bool:
    try:
        # 1. Sinh ảnh định dạng base64 để lưu trữ bền vững (kèm siêu dữ liệu C2PA gốc)
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt_text,
            size="1536x1024",
            quality="high"
        )
        image_bytes = base64.b64decode(result.data[0].b64_json)
        with open(output_file, "wb") as f:
            f.write(image_bytes)
        return True
    except BadRequestError as err:
        # 2. Xử lý êm ái khi câu mô tả của người dùng chạm bộ lọc an toàn Responsible AI
        if "content_policy_violation" in str(err):
            print("Mô tả vi phạm chính sách an toàn nội dung. Vui lòng điều chỉnh lại yêu cầu.")
            return False
        raise

# 3. Inpainting / Image Edit: Chỉ vẽ lại vùng đánh dấu trên mask.png, giữ nguyên sản phẩm gốc
with open("product_studio.png", "rb") as img_f, open("background_mask.png", "rb") as mask_f:
    edited = client.images.edit(
        model="gpt-image-1",
        image=img_f,
        mask=mask_f,
        prompt="Thay phông nền phía sau bằng bàn gỗ sồi cạnh cửa sổ ngập nắng ban mai, giữ nguyên cốc sứ"
    )`,
    codeNotes: [
      "Nhận dữ liệu qua `b64_json` và ghi trực tiếp thành file nhị phân (hoặc đẩy thẳng lên Azure Blob Storage) giúp tránh lỗi đường link ảnh hết hạn sau 60 phút và bảo toàn nguyên vẹn thông tin C2PA Content Credentials.",
      "Trong lệnh `client.images.edit`, file `background_mask.png` chỉ định vùng kênh trong suốt nơi mô hình được phép vẽ lại phông nền, giúp sản phẩm thật (`product_studio.png`) không bị biến dạng logo hay chữ in trên bao bì.",
      "Khối `except BadRequestError` kiểm tra `content_policy_violation` là mẫu xử lý lỗi bắt buộc đối với mọi ứng dụng GenAI cho phép người dùng nhập prompt tự do."
    ],
    labGuide: {
      goal: "Thực hành tạo ảnh quảng cáo sản phẩm, kiểm tra chữ ký nguồn gốc C2PA và thử nghiệm chỉnh sửa phông nền bằng Inpainting.",
      steps: [
        "Bước 1: Triển khai mô hình tạo ảnh (`gpt-image-1` hoặc `dall-e-3`) trên Microsoft Foundry project và cấu hình xác thực bằng `DefaultAzureCredential`.",
        "Bước 2: Chạy hàm `generate_marketing_banner` với câu mô tả chi tiết cả ánh sáng lẫn bố cục, sau đó tải file ảnh vừa lưu lên công cụ kiểm tra công khai `contentcredentials.org/verify` để tận mắt xem chứng nhận nguồn gốc C2PA do Microsoft ký.",
        "Bước 3: Chuẩn bị một bức ảnh sản phẩm kèm một file mask PNG có khoét vùng nền trong suốt, gọi `client.images.edit` để đổi bối cảnh mùa hè sang mùa đông mà vẫn giữ nguyên vật thể chính.",
        "Bước 4: Thử gửi một câu prompt vi phạm chính sách an toàn để xác nhận nhánh bắt lỗi `content_policy_violation` hoạt động mượt mà không làm sập chương trình."
      ],
      expectedOutput: "File ảnh chất lượng cao được lưu thành công xuống đĩa cứng, trang kiểm chứng C2PA xác nhận rõ siêu dữ liệu nguồn gốc AI của Microsoft và ảnh chỉnh sửa Inpainting giữ nguyên vẹn chi tiết sản phẩm gốc."
    },
    examTips: [
      "Từ khóa đề bài 'verify whether an image was generated by AI using cryptographic metadata manifests' -> Chọn ngay **C2PA / Content Credentials (Content Provenance)**.",
      "Từ khóa đề bài 'modify only a specific area of an existing image while keeping the rest unchanged' -> Chọn **Inpainting / Image Edit with a transparent mask**.",
      "Từ khóa đề bài 'extract structured insights, spoken transcripts, OCR text, and scene timestamps from long training videos for search/RAG' -> Chọn **Azure AI Content Understanding** hoặc **Azure AI Video Indexer**."
    ],
    summaryTakeaways: [
      "Prompt tạo ảnh hiệu quả cần mô tả rõ 4 lớp: Chủ thể, Bối cảnh, Ánh sáng/Màu sắc và Góc máy/Phong cách; nhớ lưu ảnh sang Blob Storage thay vì lưu URL tạm thời.",
      "Inpainting (`images.edit` kèm Mask) là giải pháp chuẩn để sửa đổi từng phần bức ảnh mà không làm biến dạng chi tiết sản phẩm thật.",
      "Hiểu nội dung Video đòi hỏi sự kết hợp đa kênh giữa trích xuất khung hình (keyframes), nhận diện chữ trên màn hình và gỡ băng âm thanh kèm mốc thời gian (`timestamps`).",
      "Mọi ứng dụng tạo ảnh doanh nghiệp phải tôn trọng bộ lọc nội dung kép (Content Filters) và bảo toàn siêu dữ liệu nguồn gốc C2PA chống tin giả."
    ],
    lessonQuestions: [
      {
        question: "Một hãng đồng hồ cao cấp muốn dùng AI trên Microsoft Foundry để thay đổi phong cảnh cổ tay và phông nền xung quanh chiếc đồng hồ theo từng mùa lễ hội, nhưng yêu cầu mặt số và logo khắc trên chiếc đồng hồ thật trong ảnh chụp gốc không được phép sai lệch dù chỉ một chi tiết nhỏ. Bạn nên áp dụng kỹ thuật nào?",
        options: [
          "Dùng Text-to-Image thuần túy mô tả chiếc đồng hồ bằng lời văn thật dài để AI tự vẽ lại từ đầu.",
          "Sử dụng tính năng Image Edit (Inpainting) truyền vào ảnh chụp thật kèm mặt nạ (Mask) giữ nguyên vùng mặt đồng hồ và chỉ cho phép tái tạo vùng phông nền xung quanh.",
          "Tăng tham số Temperature của mô hình chat lên mức tối đa.",
          "Chỉ dùng tính năng Smart Cropping của Azure AI Vision."
        ],
        answer: 1,
        explanation: "Text-to-Image vẽ mới hoàn toàn sẽ làm sai lệch logo và chi tiết cơ khí tinh xảo của đồng hồ thật; kỹ thuật Inpainting với Mask khóa cứng các pixel vùng đồng hồ gốc và chỉ sinh mới phần phông nền được đánh dấu.",
        wrongReasons: [
          "Mô hình tạo ảnh từ văn bản không thể tái tạo chính xác 100% từng vạch chia và logo thương hiệu của sản phẩm vật lý cụ thể.",
          "",
          "Temperature của mô hình chat không giải quyết bài toán bảo toàn pixel ảnh chụp gốc.",
          "Smart Cropping chỉ cắt khung ảnh chứ không thể tạo phông nền lễ hội mới."
        ]
      },
      {
        question: "Tòa soạn báo điện tử của bạn sử dụng mô hình sinh ảnh trên Azure để tạo ảnh minh họa cho chuyên mục Công nghệ. Ban biên tập yêu cầu mọi bức ảnh minh họa này khi xuất bản phải giữ được bằng chứng mật mã tiêu chuẩn ngành để độc giả và các nền tảng mạng xã hội xác minh minh bạch rằng ảnh được tạo bởi AI. Cơ chế nào trên Azure đáp ứng yêu cầu này?",
        options: [
          "Đổi tên file ảnh thành `ai_photo.bmp`.",
          "Tắt toàn bộ bộ lọc Azure AI Content Safety.",
          "Chuyển bức ảnh sang định dạng văn bản thuần túy `.csv`.",
          "C2PA Content Credentials (Content Provenance) được ký mật mã và nhúng trong siêu dữ liệu của ảnh sinh ra."
        ],
        answer: 3,
        explanation: "Azure áp dụng chuẩn C2PA (Content Credentials) ký số mật mã trực tiếp vào manifest siêu dữ liệu của ảnh sinh bởi AI để đảm bảo khả năng truy xuất nguồn gốc minh bạch và chống mạo danh ảnh thật.",
        wrongReasons: [
          "Tên file rất dễ bị đổi lại và không có bất kỳ giá trị xác thực mật mã nào.",
          "Tắt Content Safety vừa vi phạm chính sách Responsible AI vừa không liên quan đến chứng thực nguồn gốc.",
          "Chuyển sang `.csv` làm mất định dạng hiển thị hình ảnh trên báo điện tử.",
          ""
        ]
      }
    ]
  },

  "C3": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, quay trở lại với dữ liệu văn bản doanh nghiệp: trước khi nhét hàng triệu email khiếu nại, biên bản cuộc gọi tổng đài hay hồ sơ bệnh nhân vào kho RAG cho LLM đọc, có những tác vụ xử lý ngôn ngữ mà dùng dịch vụ chuyên dụng **Azure AI Language** vừa nhanh hơn, rẻ hơn, nhất quán hơn, lại giải quyết được bài toán tuân thủ pháp luật cực kỳ nghiêm ngặt! Thử hình dung nếu em gửi nguyên xi số Căn cước công dân, số thẻ tín dụng và số điện thoại khách hàng lên đám mây lưu log mà chưa che giấu (`PII Redaction`), công ty có thể bị phạt hàng triệu đô la. Trong bài C3 hôm nay, thầy trò mình sẽ chinh phục trọn bộ tứ trụ của Azure AI Language luôn góp mặt trong đề thi AI-103: **NER, PII Detection & Redaction, Sentiment & Opinion Mining, và Custom Text Classification**!",
    analogy: {
      title: "Bộ bút dạ quang 4 màu và cây bút xóa bảo mật của phòng Văn thư",
      body: "Em hãy hình dung dịch vụ **Azure AI Language** giống như một chuyên viên văn thư siêu tốc cầm trên tay hộp bút chuyên dụng đọc lướt qua hàng vạn lá thư khách hàng: Cây bút xanh gạch chân phân loại đâu là Tên người, đâu là Địa danh, đâu là Ngày tháng (**NER**). Cây bút đen bảo mật lập tức bôi kín Số thẻ ngân hàng, Số điện thoại thành dấu `***********` để không ai nhìn trộm được (**PII Redaction**). Cây bút hồng ghi chú cảm xúc từng khía cạnh nhỏ: khách khen `'phòng khách sạn sạch'` nhưng lại chê `'lễ tân thái độ kém'` trong cùng một câu văn (**Opinion Mining**). Và cuối cùng, nếu công ty có 12 mã phòng ban nội bộ riêng không sách vở nào dạy sẵn, em chỉ cần đưa vài chục lá thư mẫu để chuyên viên ấy học cách đóng dấu phân luồng tự động (**Custom Text Classification**)!"
    },
    objectives: [
      "Sử dụng thành thạo tính năng nhận diện thực thể có tên (NER) và phát hiện, che giấu thông tin định danh cá nhân (PII / PHI Detection & Redaction).",
      "Phân biệt rõ Sentiment Analysis cấp độ câu/văn bản với Opinion Mining (Aspect-based Sentiment) bóc tách cặp đối tượng `Target` – nhận xét `Assessment`.",
      "Chọn đúng mô hình Custom Text Classification: Single-label (đơn nhãn loại trừ nhau) so với Multi-label (đa nhãn đồng thời) và quy trình huấn luyện trên Language Studio / Foundry."
    ],
    flow: [
      {
        step: "1. Language Detection & Batching (Nhận diện ngôn ngữ & Gom lô tài liệu)",
        detail: "Gom các văn bản cần phân tích thành lô (batch) hợp lệ trong giới hạn kích thước ký tự của API và xác định mã ngôn ngữ (`vi`, `en`, `ja`...)."
      },
      {
        step: "2. PII Scrubbing Gate (Cổng tẩy xóa thông tin nhạy cảm)",
        detail: "Gọi `recognize_pii_entities` lọc theo miền (như `Healthcare / PHI` hoặc danh mục tài chính) và lấy chuỗi `redacted_text` đã thay thế thông tin nhạy cảm trước khi lưu DB hoặc đưa vào LLM."
      },
      {
        step: "3. Entity & Aspect Sentiment Extraction (Bóc tách thực thể và Cảm xúc khía cạnh)",
        detail: "Trích xuất thực thể nghiệp vụ qua NER và bật cờ `show_opinion_mining=True` để biết chính xác khách hàng hài lòng hay bất mãn về bộ phận/tính năng cụ thể nào."
      },
      {
        step: "4. Custom Domain Routing (Phân loại theo danh mục riêng doanh nghiệp)",
        detail: "Với hệ thống phân loại ticket nội bộ chuyên biệt, gọi mô hình Custom Text Classification đã huấn luyện và triển khai để gán nhãn tự động."
      }
    ],
    sections: [
      {
        heading: "1. NER vs PII Detection & Redaction: Gác cổng bảo vệ dữ liệu riêng tư trước khi vào RAG",
        paragraphs: [
          "Nhiều học viên mới học hay thắc mắc: *'Thầy ơi, cả NER và PII đều tìm tên người, địa chỉ trong câu văn, vậy sao Microsoft lại tách làm hai API riêng?'*. Điểm mấu chốt nằm ở mục đích sử dụng và hành động che giấu! **NER (`recognize_entities`)** phục vụ bài toán **khai phá tri thức tổng quát**: tìm tên Tổ chức (`Organization` như Microsoft), Địa điểm (`Location` như Hà Nội), Sự kiện, Sản phẩm, Số lượng để làm giàu metadata tìm kiếm cho Azure AI Search.",
          "Ngược lại, **PII Detection (`recognize_pii_entities`)** sinh ra đặc biệt cho bài toán **Bảo mật & Tuân thủ pháp lý (Compliance/GDPR/HIPAA)**: ngoài tên và địa chỉ nhà riêng, nó săn lùng các dữ liệu nhạy cảm như Số thẻ tín dụng (`CreditCardNumber`), Số an sinh xã hội / định danh cá nhân, Số tài khoản ngân hàng (`InternationalBankingAccountNumber`), Email, Số điện thoại, Địa chỉ IP. Tuyệt vời nhất là phản hồi của API trả sẵn luôn trường **`redacted_text`** (văn bản đã được che bằng dấu `*` hoặc thay bằng nhãn loại thực thể như `[PhoneNumber]`) — trở thành bước tiền xử lý vàng trước khi lưu lịch sử chat hoặc nạp dữ liệu vào hệ thống RAG!"
        ],
        bullets: [
          "Tham số `domain_filter=PiiEntityDomain.PROTECTED_HEALTH_INFORMATION` (`phi`): Cực kỳ hay gặp trong các câu hỏi đề thi về bệnh viện / hồ sơ y tế cần lọc thông tin sức khỏe được bảo vệ (PHI).",
          "Tham số `categories_filter`: Cho phép chỉ định chỉ che giấu một số loại cụ thể (ví dụ che số thẻ ngân hàng và SĐT nhưng giữ nguyên tên nhân viên hỗ trợ để chấm KPI).",
          "Kiểm tra điểm độ tin cậy (`confidence_score` từ 0.0 đến 1.0) để quyết định ngưỡng lọc phù hợp với khẩu vị rủi ro của doanh nghiệp."
        ]
      },
      {
        heading: "2. Sentiment Analysis và vũ khí bí mật Opinion Mining (Phân tích quan điểm theo khía cạnh)",
        paragraphs: [
          "Hãy đọc thử câu đánh giá này của một vị khách trên ứng dụng đặt phòng: *'Món phở bò buổi sáng ở nhà hàng cực kỳ đậm đà tuyệt vời, nhưng điều hòa trong phòng ngủ thì kêu to như máy cày suốt đêm!'*. Nếu em chỉ chạy **Sentiment Analysis** thông thường, cả câu văn sẽ bị chấm nhãn là **`mixed` (hỗn hợp)**! Nhãn `mixed` đó không giúp Giám đốc khách sạn biết cần khen bếp trưởng hay cần gọi thợ sửa điều hòa.",
          "Đó chính là lúc em bật tham số thần thánh **`show_opinion_mining=True`** trong hàm `analyze_sentiment`! Kỹ thuật **Opinion Mining** (còn gọi là Aspect-based Sentiment Analysis) đi sâu vào cấu trúc ngữ pháp để bóc tách thành từng cặp: **Target (Đối tượng/Khía cạnh được nói tới, đóng vai trò danh từ)** và **Assessments (Từ ngữ đánh giá gắn với đối tượng đó, đóng vai trò tính từ)**. Kết quả trả về cực kỳ sắc nét: Target `'phở bò'` -> Assessment `'đậm đà, tuyệt vời'` (`positive`); Target `'điều hòa'` -> Assessment `'kêu to'` (`negative`)!"
        ],
        bullets: [
          "Sentiment Analysis cơ bản trả về nhãn (`positive`, `neutral`, `negative`, `mixed`) cùng bộ 3 điểm xác suất cộng lại bằng 1.0 ở cả cấp độ toàn văn bản (Document) và từng câu (Sentence).",
          "**Opinion Mining** bóc tách sâu xuống dưới cấp độ câu thành mối quan hệ `Target` <-> `Assessment`, giúp doanh nghiệp thống kê chính xác tính năng nào của sản phẩm đang bị chê nhiều nhất.",
          "Khi đề thi AI-103 xuất hiện từ khóa *'identify specific product features or service aspects that customers praise or complain about within mixed reviews'* -> Chọn ngay **Sentiment Analysis with Opinion Mining**!"
        ]
      },
      {
        heading: "3. Custom Text Classification: Khi nào chọn Single-label, khi nào chọn Multi-label?",
        paragraphs: [
          "Các tính năng có sẵn (Prebuilt) như NER hay Sentiment dùng được ngay không cần huấn luyện. Nhưng nếu một công ty bảo hiểm muốn phân loại hồ sơ khiếu nại vào bộ mã nội bộ riêng của họ như `'BH-XeMay-VaCham'`, `'BH-SucKhoe-NgoaiTru'`, `'BH-NhanTho-DaoHan'`, em cần huấn luyện mô hình **Custom Text Classification** bằng cách tải dữ liệu văn bản vào Azure Blob Storage, gán nhãn trong Language Studio / Foundry, chia tập Train/Test (thường 80/20), đánh giá chỉ số Precision/Recall/F1 rồi triển khai thành deployment.",
          "Trong phòng thi, câu hỏi bẫy kinh điển ở phần này là buộc em chọn giữa hai loại dự án ngay từ lúc khởi tạo: **Single-label classification** hay **Multi-label classification**? Quy tắc nhớ cực nhanh trong 3 giây của thầy: hãy tự hỏi *'Một văn bản đầu vào chỉ được phép mang ĐÚNG 1 nhãn duy nhất, hay có thể mang NHIỀU nhãn cùng lúc?'*."
        ],
        bullets: [
          "**Single-label Classification (Đơn nhãn)**: Các lớp loại trừ lẫn nhau — mỗi văn bản chỉ thuộc đúng 1 nhóm (ví dụ: Mức độ khẩn cấp của ticket chỉ có thể là 1 trong 3 mức `P1-Khẩn`, `P2-Cao`, hoặc `P3-Thấp`).",
          "**Multi-label Classification (Đa nhãn)**: Một văn bản có thể gắn đồng thời 1, 2 hoặc nhiều nhãn (ví dụ: Một bộ phim vừa thuộc thể loại `Hành động`, vừa `Khoa học viễn tưởng`, vừa `Phiêu lưu`; hoặc một email khách hàng vừa hỏi về `Hóa đơn` vừa báo `Lỗi đăng nhập`).",
          "*Mở rộng liên quan*: Nếu cần rút trích các trường con cụ thể (như Số hợp đồng, Mức bồi thường yêu cầu) từ văn bản tự do không có bố cục cố định, hãy kết hợp với **Custom Named Entity Recognition (Custom NER)**!"
        ]
      }
    ],
    comparison: {
      title: "Bảng chọn tính năng Azure AI Language chuẩn đề thi AI-103",
      headers: ["Tính năng Language", "Loại mô hình", "Khi nào chọn (Đề thi)", "Đầu ra đặc trưng"],
      rows: [
        [
          "PII Detection & Redaction",
          "Prebuilt (Dùng ngay)",
          "Ẩn danh hóa thông tin cá nhân/y tế (PII/PHI) trước khi lưu log hoặc nạp vào RAG/LLM",
          "Danh sách thực thể nhạy cảm + chuỗi `redacted_text` đã che bằng `*`"
        ],
        [
          "Named Entity Recognition (NER)",
          "Prebuilt / Custom NER",
          "Trích xuất tên người, tổ chức, địa danh, ngày giờ (hoặc thực thể chuyên ngành riêng với Custom NER)",
          "Thực thể phân nhóm (`Person`, `Organization`, `Location`...) kèm vị trí `offset` và `confidence`"
        ],
        [
          "Sentiment + Opinion Mining",
          "Prebuilt (`show_opinion_mining=True`)",
          "Phân tích chi tiết khách hàng khen hay chê từng khía cạnh/bộ phận cụ thể trong câu đánh giá hỗn hợp",
          "Điểm cảm xúc văn bản/câu + danh sách cặp `Target` (khía cạnh) và `Assessment` (nhận xét)"
        ],
        [
          "Custom Text Classification",
          "Custom (Huấn luyện riêng)",
          "Gán nhãn phân loại tài liệu theo hệ thống danh mục nghiệp vụ riêng (Single-label hoặc Multi-label)",
          "Tên lớp phân loại dự đoán kèm điểm tự tin cho từng nhãn"
        ]
      ]
    },
    codeTitle: "Pipeline Che giấu PII an toàn và Phân tích cảm xúc khía cạnh (Opinion Mining)",
    code: `import os
from azure.identity import DefaultAzureCredential
from azure.ai.textanalytics import TextAnalyticsClient, PiiEntityCategory

# 1. Khởi tạo TextAnalyticsClient với xác thực Entra ID chuẩn doanh nghiệp
lang_client = TextAnalyticsClient(
    endpoint=os.environ["LANGUAGE_ENDPOINT"],
    credential=DefaultAzureCredential()
)

raw_feedback = [
    "Tôi là Minh (SĐT 0912345678, email minh.ng@contoso.com). Pin laptop rất trâu nhưng bàn phím bị kẹt nút Space!"
]

# 2. Bước 1: Phát hiện & Che giấu PII trước khi lưu trữ hoặc đẩy sang hệ thống phân tích khác
pii_result = lang_client.recognize_pii_entities(
    documents=raw_feedback,
    language="vi",
    categories_filter=[PiiEntityCategory.PHONE_NUMBER, PiiEntityCategory.EMAIL]
)[0]
safe_text = pii_result.redacted_text
print("Văn bản đã làm sạch PII:", safe_text)

# 3. Bước 2: Phân tích cảm xúc kèm Opinion Mining để bóc tách từng khía cạnh khen/chê
sentiment_result = lang_client.analyze_sentiment(
    documents=[safe_text],
    language="en" if False else "vi",
    show_opinion_mining=True
)[0]

for sentence in sentiment_result.sentences:
    for mined in sentence.mined_opinions:
        assessments = ", ".join([f"'{a.text}' ({a.sentiment})" for a in mined.assessments])
        print(f"Khía cạnh [{mined.target.text}] ({mined.target.sentiment}) -> Nhận xét: {assessments}")`,
    codeNotes: [
      "`pii_result.redacted_text` tự động thay thế đúng vị trí số điện thoại `0912345678` và địa chỉ email bằng ký tự `*` mà giữ nguyên vẹn phần nhận xét sản phẩm phía sau để phân tích tiếp.",
      "Tham số `categories_filter` giúp em chủ động giữ lại tên khách hàng (`Minh`) nếu kịch bản CSKH cần xưng hô thân thiện, trong khi vẫn xóa sạch thông tin liên lạc nhạy cảm.",
      "Cấu trúc lồng nhau của Opinion Mining luôn đi theo thứ tự: `document.sentences` -> `sentence.mined_opinions` -> `mined.target` (danh từ khía cạnh, ví dụ `'Pin'`, `'bàn phím'`) và mảng `mined.assessments` (tính từ đánh giá)."
    ],
    labGuide: {
      goal: "Xây dựng bộ lọc làm sạch thông tin cá nhân tự động cho kênh phản hồi khách hàng và trích xuất báo cáo khen/chê theo từng bộ phận sản phẩm.",
      steps: [
        "Bước 1: Tạo tài nguyên Azure AI Language (hoặc Azure AI Services), gán quyền `Cognitive Services Language Reader` / `Cognitive Services User` cho tài khoản Entra ID đang đăng nhập CLI.",
        "Bước 2: Chuẩn bị mảng 5 câu bình luận sản phẩm thực tế có chứa SĐT, Email, Số căn cước giả lập và cả lời khen lẫn lời chê trong cùng một câu văn.",
        "Bước 3: Chạy `recognize_pii_entities` (thử nghiệm cả khi truyền và không truyền `categories_filter`) để kiểm chứng chuỗi `redacted_text` đã ẩn sạch dữ liệu nhạy cảm.",
        "Bước 4: Đưa mảng văn bản sạch qua `analyze_sentiment(..., show_opinion_mining=True)` (thử trên cả mẫu câu tiếng Anh và ngôn ngữ được hỗ trợ Opinion Mining) rồi tổng hợp bảng thống kê khía cạnh nào nhận nhiều `negative` nhất."
      ],
      expectedOutput: "Toàn bộ SĐT và Email bị che thành `**********`; bảng kết quả bóc tách rõ khía cạnh `Pin` mang sắc thái `positive` và khía cạnh `bàn phím` mang sắc thái `negative` thay vì chỉ gộp chung một nhãn `mixed`."
    },
    examTips: [
      "Từ khóa đề bài 'mask / scrub sensitive personal or health information (SSN, phone numbers, PHI) before indexing into RAG or storing logs' -> Chọn **Azure AI Language PII Detection (`redacted_text` / `domain_filter='phi'`)**.",
      "Từ khóa đề bài 'extract fine-grained customer sentiment toward specific attributes (e.g., room cleanliness vs staff friendliness) in the same sentence' -> Chọn **Sentiment Analysis with `show_opinion_mining=True`**.",
      "Từ khóa đề bài 'classify support tickets where each ticket can belong to multiple departments simultaneously' -> Chọn **Custom Multi-label Text Classification** (còn nếu chỉ thuộc duy nhất 1 mức ưu tiên -> **Single-label**)."
    ],
    summaryTakeaways: [
      "Đặt PII Detection & Redaction làm bước tiền xử lý bắt buộc trước khi ghi nhật ký hội thoại hoặc nạp dữ liệu thô của khách hàng vào kho RAG.",
      "NER giúp trích xuất thực thể làm giàu siêu dữ liệu tìm kiếm; Custom NER mở rộng cho các thực thể đặc thù chuyên ngành.",
      "Opinion Mining vượt qua giới hạn nhãn `mixed` chung chung bằng cách liên kết chính xác từng đối tượng `Target` với nhận xét `Assessment`.",
      "Phân biệt rõ Single-label (các nhãn loại trừ nhau, chọn đúng 1) và Multi-label (gán đồng thời nhiều nhãn cho cùng 1 văn bản) khi huấn luyện Custom Classification."
    ],
    lessonQuestions: [
      {
        question: "Một bệnh viện muốn đưa các ghi chú khám bệnh tự do của bác sĩ vào hệ thống tìm kiếm phân tích nội bộ, nhưng quy định bảo mật y tế yêu cầu phải tự động phát hiện và thay thế toàn bộ tên bệnh nhân, số điện thoại, số bảo hiểm và thông tin sức khỏe định danh (PHI) bằng ký tự che giấu trước khi lưu trữ. Dịch vụ và tính năng nào phù hợp nhất?",
        options: [
          "Azure AI Language - Sentiment Analysis với cờ `show_opinion_mining=True`.",
          "Azure AI Language - PII Detection với cấu hình lọc miền `phi` (Protected Health Information) và sử dụng đầu ra `redacted_text`.",
          "Azure AI Vision - Smart Cropping.",
          "Key Phrase Extraction (Trích xuất cụm từ khóa chính)."
        ],
        answer: 1,
        explanation: "Tính năng PII Detection của Azure AI Language hỗ trợ riêng miền y tế `phi` (Protected Health Information) để nhận diện chính xác thông tin định danh bệnh nhân và trả sẵn chuỗi văn bản đã được che giấu trong `redacted_text`.",
        wrongReasons: [
          "Sentiment Analysis chỉ đo sắc thái cảm xúc chứ không phát hiện hay che giấu thông tin cá nhân.",
          "",
          "Smart Cropping là tính năng cắt ảnh thu nhỏ, không xử lý văn bản y tế.",
          "Key Phrase Extraction chỉ rút ra chủ đề chính và vẫn làm lộ nguyên văn thông tin nhạy cảm trong tài liệu gốc."
        ]
      },
      {
        question: "Hệ thống tiếp nhận thư điện tử của một công ty viễn thông cần tự động gắn thẻ chủ đề cho mỗi email khách hàng gửi tới. Một email đơn lẻ của khách hàng thường đề cập đồng thời tới cả 'Khiếu nại cước phí', 'Yêu cầu nâng cấp gói mạng' và 'Cập nhật địa chỉ thanh toán'. Bạn nên huấn luyện loại mô hình nào trong Azure AI Language?",
        options: [
          "Custom Single-label Text Classification.",
          "Custom Multi-label Text Classification.",
          "Language Detection tiêu chuẩn.",
          "Prebuilt Receipt OCR."
        ],
        answer: 1,
        explanation: "Vì một văn bản đầu vào có thể thuộc đồng thời nhiều danh mục nghiệp vụ không loại trừ lẫn nhau, Custom Multi-label Text Classification là lựa chọn chính xác để dự đoán tập hợp nhiều nhãn cho cùng một email.",
        wrongReasons: [
          "Single-label chỉ gán duy nhất 1 nhãn có xác suất cao nhất nên sẽ làm bỏ sót 2 yêu cầu còn lại trong email của khách.",
          "",
          "Language Detection chỉ cho biết email viết bằng tiếng Việt hay tiếng Anh.",
          "Receipt OCR dùng để đọc hóa đơn bán lẻ dạng ảnh, không phân loại đa chủ đề email."
        ]
      }
    ]
  },

  "C4": {
    duration: "50 phút",
    difficulty: "Trung cấp (AI-103)",
    teacherIntro: "Chào em, hãy bước vào một trung tâm chăm sóc khách hàng (Contact Center) của hãng hàng không: một mặt là hàng trăm cuộc gọi trực tiếp đang diễn ra cần AI nghe hiểu và dịch thuật ngay trong từng nhịp thở; mặt khác là 50.000 file ghi âm cuộc gọi của ngày hôm qua nằm trong kho lưu trữ chờ gỡ băng hàng loạt vào ban đêm để kiểm tra chất lượng phục vụ. Tất cả những kịch bản giọng nói đó đều quy tụ về dịch vụ **Azure AI Speech**. Trong đề thi AI-103, thầy đặc biệt lưu ý em 4 trọng tâm luôn được hỏi xoáy: khi nào chọn **Real-time STT** so với **Batch Transcription**, cách dùng thẻ **SSML** điều khiển giọng đọc **Neural TTS**, dịch giọng nói một-nhiều (**Speech Translation**), và quy định bắt buộc về sự đồng thuận giọng nói (**Voice Consent & Privacy**) khi nhân bản giọng đọc thương hiệu!",
    analogy: {
      title: "Cabin phiên dịch viên đồng thời tại hội nghị và Tổ thư ký gỡ băng sau giờ họp",
      body: "Em hãy hình dung **Real-time STT và Speech Translation** giống như vị phiên dịch viên đeo tai nghe ngồi trong cabin kính tại hội nghị quốc tế: diễn giả trên bục vừa cất lời tiếng Nhật đến đâu, chỉ tích tắc 0.5 giây sau tai nghe của khán giả bên dưới đã vang lên tiếng Việt và tiếng Anh cùng lúc! Ngược lại, **Batch Transcription** giống như tổ thư ký nhận một thùng lớn chứa 2.000 cuộn băng ghi âm cũ từ kho lưu trữ: họ không cần trả kết quả ngay lập tức trên từng giây mà chia nhau xử lý ngầm với chi phí rẻ hơn, phân biệt rõ giọng Người nói số 1 và Người nói số 2 (Diarization). Và nếu công ty muốn tạo giọng AI giống hệt giọng phát thanh viên nổi tiếng, pháp luật bắt buộc chính người đó phải tự đọc một câu tuyên bố đồng ý ghi âm rõ ràng (**Voice Consent**) thì phòng thu mới được phép mở máy!"
    },
    objectives: [
      "Phân biệt chính xác kiến trúc và trường hợp sử dụng giữa Real-time Speech-to-Text (`recognize_once` / `continuous`) với Batch Transcription REST API.",
      "Làm chủ tổng hợp giọng nói tự nhiên Neural Text-to-Speech kết hợp ngôn ngữ đánh dấu SSML để tinh chỉnh tốc độ, cao độ và cách phát âm từ chuyên ngành.",
      "Triển khai dịch giọng nói đa đích (`TranslationRecognizer`) và nắm vững quy tắc đạo đức Responsible AI về Voice Consent & bảo mật dữ liệu âm thanh."
    ],
    flow: [
      {
        step: "1. Audio Source & Mode Selection (Chọn chế độ theo luồng âm thanh)",
        detail: "Luồng micro/tổng đài trực tiếp đi vào Real-time SDK qua kết nối WebSocket độ trễ thấp; kho hàng nghìn file `.wav/.mp3` trên Azure Blob Storage đi vào Batch Transcription API bất đồng bộ."
      },
      {
        step: "2. Recognition, Phrase List & Translation (Nhận dạng & Dịch thuật đa ngữ)",
        detail: "Áp dụng `PhraseListGrammar` để tăng độ nhạy cho tên riêng/thuật ngữ nội bộ; nếu dùng `TranslationRecognizer`, xuất đồng thời bản dịch văn bản sang nhiều ngôn ngữ đích trong 1 lượt."
      },
      {
        step: "3. Neural TTS Synthesis with SSML (Tổng hợp giọng đọc giàu biểu cảm)",
        detail: "Biến phản hồi văn bản của Agent thành âm thanh tự nhiên qua giọng Neural chuẩn, tinh chỉnh nhịp nghỉ (`<break>`), phát âm phiên âm (`<phoneme>`) bằng cấu trúc XML chuẩn SSML."
      },
      {
        step: "4. Consent Verification & Audio Privacy (Kiểm chứng đồng thuận & Quyền riêng tư)",
        detail: "Với giọng nói tùy chỉnh (Custom Neural Voice / Personal Voice), xác thực tệp ghi âm đồng thuận chính chủ (`verbal consent`) và không lưu trữ trái phép dữ liệu giọng nói nhạy cảm."
      }
    ],
    sections: [
      {
        heading: "1. Real-time STT vs Batch Transcription: Đừng dùng sai công cụ cho kho file lớn!",
        paragraphs: [
          "Trong đề thi AI-103, một cái bẫy rất quen thuộc là đề bài cho kịch bản: *'Công ty có 10.000 file ghi âm cuộc gọi lưu trong Azure Blob Storage mỗi tối cần chuyển thành văn bản có tách biệt giọng nhân viên và giọng khách hàng (Speaker Diarization)'*. Nếu thí sinh chọn viết vòng lặp `for` gọi `recognize_once_async()` từng file một thì vừa chậm, dễ chạm giới hạn kết nối đồng thời, vừa sai chuẩn kiến trúc! Đáp án chính xác bắt buộc là **Batch Transcription API** — em chỉ cần gửi đường dẫn container SAS / Managed Identity của Blob Storage, dịch vụ sẽ tự xếp hàng xử lý ngầm hàng loạt và ghi file kết quả JSON có dấu thời gian cùng nhãn `Speaker 1 / Speaker 2`.",
          "Ngược lại, khi làm trợ lý giọng nói tương tác trực tiếp với người dùng qua micro hoặc luồng điện thoại VoIP, em dùng **Real-time STT** trong Speech SDK. Trong đó lại chia làm hai hàm rất rõ: `recognize_once_async()` chỉ nghe **đúng một câu khẩu lệnh ngắn** (tối đa khoảng 15–30 giây hoặc dừng ngay khi người nói ngắt nghỉ im lặng, rất hợp cho nút bấm ra lệnh `'Bật đèn phòng khách'`); còn `start_continuous_recognition_async()` dùng cho **cuộc hội thoại dài hoặc ghi biên bản cuộc họp trực tiếp**, phát sự kiện liên tục qua các callback `recognizing` (chữ đang nhảy tạm thời) và `recognized` (câu đã chốt chuẩn xác)."
        ],
        bullets: [
          "**Mẹo tăng độ chính xác không cần train lại model**: Dùng **`PhraseListGrammar`** nạp danh sách tên sản phẩm riêng, tên thuốc hoặc từ viết tắt công ty (ví dụ `'ContosoPay'`, `'AzuraMed'`) ngay lúc runtime để bộ nhận dạng ưu tiên bắt đúng từ đó!",
          "**Custom Speech**: Chỉ dùng khi môi trường có tiếng ồn đặc thù (nhà xưởng cơ khí, buồng lái) hoặc phương ngữ/thuật ngữ chuyên sâu mà Phrase List chưa đủ đáp ứng.",
          "**Fast Transcription API**: Lựa chọn trung gian mới rất nhanh khi cần gỡ băng đồng bộ 1 file âm thanh đã ghi sẵn (dài dưới 2 giờ) nhanh hơn nhiều lần so với tốc độ phát thực tế."
        ]
      },
      {
        heading: "2. Neural TTS với SSML và Dịch giọng nói đồng thời (Speech Translation)",
        paragraphs: [
          "Khi biến câu trả lời của AI thành tiếng nói qua **Neural Text-to-Speech (TTS)**, truyền chuỗi văn bản thô (`SpeakTextAsync`) chỉ phù hợp cho câu thông báo đơn giản. Thực tế doanh nghiệp ngân hàng hay y tế luôn gặp tình huống: chữ `'10/05'` cần đọc đúng định dạng ngày tháng chứ không đọc là `'mười phần năm'`, mã OTP `'4829'` phải đọc chậm từng chữ số rời rạc thay vì đọc `'bốn nghìn tám trăm hai mươi chín'`, hoặc tên thương hiệu nước ngoài cần đọc đúng phiên âm quốc tế IPA. Tất cả những quyền năng đó đều nằm trong **SSML (Speech Synthesis Markup Language)**!",
          "Bên cạnh đó, tính năng **Speech Translation (`TranslationRecognizer`)** là một viên ngọc quý của Azure AI Speech: thay vì phải ghép thủ công 3 dịch vụ rời rạc (STT -> Translator -> TTS) gây cộng dồn độ trễ mạng, `SpeechTranslationConfig` cho phép nhận 1 luồng giọng nói nguồn (ví dụ tiếng Việt `vi-VN`) và dịch **đồng thời ra nhiều ngôn ngữ đích (`en`, `ja`, `fr`) trong cùng một lần xử lý**, thậm chí phát ra luôn luồng âm thanh đã dịch bằng sự kiện `synthesizing`!"
        ],
        bullets: [
          "Các thẻ SSML trọng tâm hay xuất hiện trong đề thi: `<voice name='...'>` (chọn giọng đọc, có thể đổi nhiều giọng trong 1 văn bản), `<prosody rate='...' pitch='...'>` (chỉnh tốc độ, cao độ, âm lượng), `<break time='500ms'/>` (chèn nhịp nghỉ), `<say-as interpret-as='digits/date'>` (ép cách đọc số/ngày) và `<phoneme>` (ép cách phát âm chuẩn).",
          "Trong `SpeechTranslationConfig`, `speech_recognition_language` nhận mã đầy đủ kiểu `vi-VN` hoặc `en-US`, còn `add_target_language(...)` nhận mã ngôn ngữ đích như `'en'`, `'ja'`, `'ko'`.",
          "Khi cần đồng bộ khẩu hình nhân vật ảo 2D/3D trên màn hình ki-ốt với giọng đọc TTS, lắng nghe sự kiện **`VisemeReceived`** (trả về mã hình dáng môi theo từng mili-giây âm thanh)."
        ]
      },
      {
        heading: "3. Voice Consent, Limited Access & Quyền riêng tư dữ liệu giọng nói",
        paragraphs: [
          "Giọng nói là dữ liệu sinh trắc học cực kỳ nhạy cảm — kẻ xấu có thể lợi dụng công nghệ nhái giọng để lừa đảo chuyển tiền qua điện thoại. Vì vậy, Microsoft áp dụng rào chắn **Responsible AI và Limited Access** nghiêm ngặt bậc nhất đối với tính năng **Custom Neural Voice / Personal Voice** (tạo giọng đọc AI mang âm sắc riêng của diễn viên lồng tiếng hoặc phát ngôn viên thương hiệu). Phần này là câu hỏi 'ăn điểm đạo đức AI' rất quen thuộc trong đề thi!",
          "Cụ thể, để tạo một hồ sơ giọng nói tùy chỉnh, doanh nghiệp KHÔNG THỂ tự ý lấy băng ghi âm trên mạng của một người rồi tải lên huấn luyện. Hệ thống kỹ thuật bắt buộc phải tải lên **tệp âm thanh tuyên bố đồng thuận bằng lời nói (`verbal consent statement`)** do chính người sở hữu giọng nói đó đọc nguyên văn câu mẫu quy định của Microsoft, hệ thống sẽ đối khớp sinh trắc xem giọng người đọc tờ cam kết có trùng khớp với giọng trong tập dữ liệu huấn luyện hay không rồi mới mở khóa tạo model!"
        ],
        bullets: [
          "**Explicit Verbal Consent**: Bắt buộc có bản ghi âm lời nói xác nhận đồng ý của chính diễn viên lồng tiếng gắn rõ tên công ty được cấp phép sử dụng.",
          "**Disclosure & Watermarking**: Phải thông báo minh bạch cho người nghe biết họ đang tương tác với giọng nói tổng hợp bởi AI và hệ thống nhúng dấu thủy vân âm thanh ẩn để truy vết chống lạm dụng.",
          "**No Audio Retention by Default**: Trong dịch vụ Real-time STT/TTS tiêu chuẩn, Microsoft không lưu giữ nội dung âm thanh của khách hàng để huấn luyện mô hình chung; với dữ liệu nhạy cảm cao, doanh nghiệp có thể triển khai Speech container chạy ngay tại chỗ (Disconnected / Connected Containers)."
        ]
      }
    ],
    comparison: {
      title: "Bảng chọn tính năng Azure AI Speech chuẩn đề thi AI-103",
      headers: ["Bài toán thực tế", "Tính năng / API khuyên dùng", "Cơ chế hoạt động", "Lưu ý quan trọng khi đi thi"],
      rows: [
        [
          "Khẩu lệnh ngắn hoặc hội thoại trực tiếp qua micro/điện thoại",
          "Real-time STT (`SpeechRecognizer`)",
          "Truyền luồng âm thanh trực tiếp; dùng `recognize_once` (câu ngắn) hoặc `continuous` (hội thoại dài)",
          "Dùng `PhraseListGrammar` để nhận diện chuẩn tên riêng/từ viết tắt mà không cần train lại"
        ],
        [
          "Gỡ băng hàng nghìn file ghi âm có sẵn trong kho lưu trữ",
          "Batch Transcription REST API",
          "Đọc bất đồng bộ trực tiếp từ Azure Blob Storage, hỗ trợ tách người nói (Diarization)",
          "Không trả kết quả tức thời theo luồng trực tiếp; tối ưu chi phí và thông lượng lớn"
        ],
        [
          "Đọc thông báo tự nhiên cần nhấn nhá, đọc từng chữ số mã PIN, phát âm chuẩn",
          "Neural TTS + SSML (`SpeakSsmlAsync`)",
          "Định nghĩa cấu trúc XML kiểm soát `<prosody>`, `<say-as>`, `<phoneme>`, `<break>`",
          "Nếu đồng bộ chuyển động môi nhân vật 3D/Avatar, đăng ký thêm sự kiện `VisemeReceived`"
        ],
        [
          "Dịch trực tiếp lời nói của diễn giả sang 3 ngôn ngữ cùng lúc",
          "Speech Translation (`TranslationRecognizer`)",
          "Một pipeline duy nhất nhận 1 ngôn ngữ nói nguồn và xuất đồng thời nhiều bản dịch đích",
          "Giảm độ trễ đáng kể so với việc nối thủ công STT rời + Text Translator rời"
        ]
      ]
    },
    codeTitle: "Dịch giọng nói đa ngôn ngữ thời gian thực và Tổng hợp giọng đọc kiểm soát bằng SSML",
    code: `import os
import azure.cognitiveservices.speech as speechsdk
from azure.identity import DefaultAzureCredential

# 1. Lấy Entra ID token cho dịch vụ Speech (kết hợp Resource ID + Region)
cred = DefaultAzureCredential()
aad_token = cred.get_token("https://cognitiveservices.azure.com/.default").token
auth_token = f"aad#{os.environ['SPEECH_RESOURCE_ID']}#{aad_token}"

# 2. Cấu hình dịch trực tiếp 1 luồng tiếng Việt sang đồng thời tiếng Anh và tiếng Nhật
trans_config = speechsdk.translation.SpeechTranslationConfig(
    auth_token=auth_token, region=os.environ["SPEECH_REGION"]
)
trans_config.speech_recognition_language = "vi-VN"
for target_lang in ["en", "ja"]:
    trans_config.add_target_language(target_lang)

audio_in = speechsdk.audio.AudioConfig(filename="customer_call_vi.wav")
translator = speechsdk.translation.TranslationRecognizer(translation_config=trans_config, audio_config=audio_in)

# Bổ sung Phrase List để bắt chuẩn tên sản phẩm nội bộ không có trong từ điển phổ thông
phrase_list = speechsdk.PhraseListGrammar.from_recognizer(translator)
phrase_list.addPhrase("ContosoCloud Pro")

res = translator.recognize_once_async().get()
if res.reason == speechsdk.ResultReason.TranslatedSpeech:
    print("Bản dịch EN:", res.translations["en"], "| JA:", res.translations["ja"])

# 3. Tổng hợp giọng đọc Neural TTS với SSML để đọc rời từng chữ số mã xác thực OTP
speech_cfg = speechsdk.SpeechConfig(auth_token=auth_token, region=os.environ["SPEECH_REGION"])
synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_cfg, audio_config=None)
ssml_payload = """<speak version='1.0' xml:lang='vi-VN'>
  <voice name='vi-VN-HoaiMyNeural'>
    Mã xác thực của quý khách là <break time='300ms'/>
    <say-as interpret-as='digits'>8049</say-as>.
    <prosody rate='-10%'>Vui lòng không chia sẻ mã này cho bất kỳ ai.</prosody>
  </voice>
</speak>"""
tts_res = synthesizer.speak_ssml_async(ssml_payload).get()`,
    codeNotes: [
      "Khi xác thực không mật khẩu (Entra ID) với Speech SDK, định dạng chuỗi `auth_token` chuẩn là `aad#<RESOURCE_ID>#<ENTRA_ACCESS_TOKEN>` đi kèm `region`.",
      "`PhraseListGrammar.from_recognizer(...)` là mẹo thực chiến cực gọn giúp hệ thống nghe chuẩn tên thương hiệu riêng như `'ContosoCloud Pro'` ngay lập tức mà không mất một phút huấn luyện nào.",
      "Trong đoạn SSML, thẻ `<say-as interpret-as='digits'>8049</say-as>` ép giọng đọc `vi-VN-HoaiMyNeural` đọc tách bạch `'tám - không - bốn - chín'` thay vì đọc hàng nghìn, kết hợp `<prosody rate='-10%'>` làm chậm câu cảnh báo bảo mật cuối cùng."
    ],
    labGuide: {
      goal: "Thực hành dịch tệp âm thanh tiếng Việt sang đa ngôn ngữ và tinh chỉnh ngữ điệu câu trả lời bằng các thẻ SSML.",
      steps: [
        "Bước 1: Tạo tài nguyên Azure AI Speech (hoặc dùng chung Azure AI Services), ghi lại `Resource ID` cùng `Region` và cấp quyền `Cognitive Services Speech User`.",
        "Bước 2: Ghi âm một file `customer_call_vi.wav` (định dạng PCM 16kHz mono) có nhắc tới tên riêng đặc biệt của dự án, thử chạy nhận dạng trước và sau khi thêm `PhraseListGrammar` để so sánh độ chính xác.",
        "Bước 3: Chạy `TranslationRecognizer` dịch đồng thời sang tiếng Anh (`en`) và tiếng Nhật (`ja`), kiểm tra dictionary `res.translations` trả về.",
        "Bước 4: Viết 1 đoạn SSML kết hợp `<break>`, `<say-as interpret-as='digits'>` và `<prosody>`, xuất luồng byte `tts_res.audio_data` ra file `otp_prompt.wav` rồi mở nghe kiểm chứng."
      ],
      expectedOutput: "Tên sản phẩm riêng được nhận diện chính xác 100% nhờ Phrase List, bản dịch tiếng Anh và tiếng Nhật xuất ra cùng lúc từ 1 lần đọc file, và file âm thanh đầu ra đọc tách rời rõ ràng từng số của mã OTP."
    },
    examTips: [
      "Từ khóa đề bài 'transcribe thousands of stored call center audio files asynchronously from Azure Blob Storage with speaker diarization' -> Chọn **Batch Transcription API**.",
      "Từ khóa đề bài 'control pronunciation of medical acronyms, pause duration, speaking rate, or read numbers digit-by-digit in TTS' -> Sử dụng **SSML (Speech Synthesis Markup Language)**.",
      "Từ khóa đề bài 'create a Custom Neural Voice / Personal Voice matching a brand spokesperson' -> Bắt buộc phải có **recorded verbal consent statement from the voice talent** và đăng ký quyền truy cập theo chính sách Responsible AI."
    ],
    summaryTakeaways: [
      "Chọn Real-time STT cho tương tác trực tiếp độ trễ thấp (`recognize_once` cho lệnh đơn, `continuous` cho hội thoại dài) và chọn Batch Transcription cho kho file âm thanh lớn trong Blob Storage.",
      "Tận dụng `PhraseListGrammar` làm giải pháp đầu tay nhẹ nhàng nhất để cải thiện nhận dạng tên riêng và từ vựng chuyên ngành.",
      "SSML trao quyền kiểm soát tinh vi từng nhịp nghỉ, tốc độ, cao độ và cách đọc chữ số/phiên âm cho Neural TTS.",
      "Mọi giải pháp nhân bản/tùy chỉnh giọng nói phải tuân thủ tuyệt đối yêu cầu ghi âm lời đồng thuận chính chủ (Voice Consent) và minh bạch với người dùng cuối."
    ],
    lessonQuestions: [
      {
        question: "Một ngân hàng số cần xử lý 25.000 tệp ghi âm cuộc gọi lưu trữ hàng ngày trong Azure Blob Storage để chuyển thành văn bản phục vụ kiểm toán tuân thủ vào sáng hôm sau, đồng thời cần phân biệt rõ đoạn nào do nhân viên nói và đoạn nào do khách hàng nói. Giải pháp nào tối ưu nhất?",
        options: [
          "Gọi hàm `recognize_once_async()` tuần tự cho từng tệp trên một luồng duy nhất.",
          "Sử dụng Azure AI Speech Batch Transcription API kết nối tới container Blob Storage với tính năng Speaker Diarization được bật.",
          "Chỉ sử dụng thẻ `<prosody>` trong SSML.",
          "Chuyển tệp âm thanh sang ảnh PNG rồi đưa vào Azure AI Vision."
        ],
        answer: 1,
        explanation: "Batch Transcription API được thiết kế chuyên biệt để xử lý bất đồng bộ khối lượng lớn tệp âm thanh trực tiếp từ Azure Blob Storage với chi phí tối ưu và hỗ trợ sẵn tính năng phân tách người nói (Speaker Diarization).",
        wrongReasons: [
          "`recognize_once_async()` chỉ nhận dạng tối đa vài chục giây đầu của mỗi tệp và không phù hợp cho xử lý lô 25.000 cuộc gọi dài.",
          "",
          "SSML dùng cho chiều chuyển văn bản thành giọng nói (TTS), không phải nhận dạng giọng nói (STT).",
          "Tệp âm thanh không thể đọc nội dung lời thoại qua công cụ thị giác ảnh PNG."
        ]
      },
      {
        question: "Trợ lý tổng đài tự động của bệnh viện sử dụng Azure AI Speech Neural TTS để đọc lịch tái khám và tên thuốc chuyên khoa có cách phát âm đặc biệt, đồng thời phải đọc chậm mã số hồ sơ từng chữ số một. Bạn nên thực hiện cách nào?",
        options: [
          "Huấn luyện lại toàn bộ mô hình LLM nền tảng từ đầu.",
          "Cấu hình đầu vào bằng SSML sử dụng các thẻ `<phoneme>`, `<say-as interpret-as='digits'>` và `<prosody>`.",
          "Tăng âm lượng loa vật lý lên gấp đôi.",
          "Dùng Batch Transcription API để đọc văn bản."
        ],
        answer: 1,
        explanation: "SSML cung cấp các thẻ chuẩn XML như `<phoneme>` (chỉ định cách phát âm tên thuốc theo bảng phiên âm), `<say-as interpret-as='digits'>` (đọc từng chữ số) và `<prosody>` (điều chỉnh tốc độ nói chậm lại rõ ràng).",
        wrongReasons: [
          "LLM chỉ sinh văn bản chứ không điều khiển trực tiếp bộ tổng hợp âm vị của giọng đọc TTS.",
          "",
          "Tăng âm lượng không sửa được lỗi phát âm sai tên thuốc hay cách đọc gộp chữ số.",
          "Batch Transcription là công cụ chuyển giọng nói thành chữ, ngược chiều với yêu cầu TTS."
        ]
      }
    ]
  },

  "C5": {
    duration: "55 phút",
    difficulty: "Trung cấp – Nâng cao (AI-103)",
    teacherIntro: "Chào em, thầy từng chứng kiến rất nhiều dự án RAG thất bại thảm hại dù dùng cả GPT-4o lẫn Azure AI Search xịn nhất — chỉ vì một lý do cực kỳ đời thường: khâu đọc file PDF ban đầu dùng thư viện miễn phí cắt ngang lưng các bảng biểu tài chính làm cột số tiền nhảy lộn xộn sang cột thuế suất! Trong doanh nghiệp thực tế, tri thức quý giá nhất nằm trong hợp đồng scan, hóa đơn đỏ, biên lai công tác, báo cáo tài chính nhiều cột và biểu mẫu có ô tích chọn (`checkbox`). Người hùng giải quyết trọn vẹn bài toán này chính là **Azure AI Document Intelligence**! Đi thi AI-103, em bắt buộc phải chọn đúng như in giữa 4 cấp độ mô hình (**Read vs Layout vs Prebuilt vs Custom Template/Neural**), biết dùng **Confidence Scores** để kiểm soát rủi ro sai số và xuất định dạng **Markdown** chuẩn vàng cho hệ thống RAG!",
    analogy: {
      title: "Bốn cấp độ đọc tài liệu: Từ cậu bé đánh vần từng chữ đến Kế toán trưởng sành sỏi",
      body: "Em hãy hình dung 4 nhóm mô hình trong Document Intelligence giống như 4 người đọc một tập hồ sơ: Người thứ nhất (**Read model**) chỉ chăm chú đọc chuẩn từng dòng chữ viết tay và chữ in từ trên xuống dưới như đọc tiểu thuyết, không quan tâm kẻ bảng gì cả. Người thứ hai (**Layout model**) có con mắt kiến trúc sư: nhìn thấu đâu là Tiêu đề lớn H1, đâu là Bảng gộp ô phức tạp, đâu là ô Checkbox đã tích dấu `X`, rồi vẽ lại nguyên vẹn thành bảng **Markdown** cực đẹp! Người thứ ba (**Prebuilt Invoice/Receipt**) là cô kế toán lành nghề đã thuộc lòng hàng triệu hóa đơn thế giới: nhìn vào biết ngay con số nào là `InvoiceTotal`, tên nào là `VendorName` mà chẳng cần ai chỉ dạy. Còn nếu công ty em có tờ phiếu xuất kho mẫu riêng độc nhất vô nhị, em gọi người thứ tư (**Custom Model**) học trên đúng 5 tờ mẫu của công ty là bóc tách chuẩn từng ô!"
    },
    objectives: [
      "Lựa chọn chính xác giữa `prebuilt-read`, `prebuilt-layout`, các mô hình dựng sẵn (`prebuilt-invoice`, `prebuilt-receipt`, `prebuilt-idDocument`) và Custom Models (`Template` vs `Neural`).",
      "Sử dụng định dạng đầu ra `DocumentContentFormat.MARKDOWN` của Layout model để bảo toàn trọn vẹn cấu trúc tiêu đề và bảng biểu cho kiến trúc RAG.",
      "Đánh giá điểm độ tin cậy (`confidence` cấp độ trường và cấp độ từ) để tự động chuyển các biểu mẫu mờ nhòe sang con người kiểm tra."
    ],
    flow: [
      {
        step: "1. Document Intake & Model Selection (Tiếp nhận tệp & Chọn đúng mô hình)",
        detail: "Nhận tệp PDF, ảnh chụp hoặc Office (DOCX/XLSX/PPTX/HTML); chọn mô hình tối ưu chi phí nhất đáp ứng đúng yêu cầu cấu trúc/trường dữ liệu."
      },
      {
        step: "2. Asynchronous Layout / Field Analysis (Phân tích bất đồng bộ Poller)",
        detail: "Gọi `begin_analyze_document(...)` trả về đối tượng `LROPoller` chờ dịch vụ quét OCR độ phân giải cao, phục hồi cấu trúc bảng, ô chọn (`selectionMarks`) và cặp khóa-giá trị."
      },
      {
        step: "3. Confidence Threshold Validation (Kiểm định ngưỡng tin cậy số liệu)",
        detail: "Duyệt qua điểm `field.confidence` (0.0–1.0) và tọa độ đa giác `bounding_regions`; nếu trường số tiền hoặc mã số thuế có `confidence < 0.85`, đánh cờ chuyển sang hàng đợi thẩm định thủ công."
      },
      {
        step: "4. Markdown Chunking for RAG (Xuất chuẩn Markdown nạp kho Vector)",
        detail: "Với kho tài liệu RAG, lấy chuỗi `result.content` ở định dạng Markdown giữ nguyên bảng biểu và phân cấp tiêu đề `#`, `##` để cắt chunk theo ngữ nghĩa không làm gãy dòng/cột."
      }
    ],
    sections: [
      {
        heading: "1. Bản đồ chọn mô hình chuẩn xác: Read vs Layout vs Prebuilt vs Custom",
        paragraphs: [
          "Trong đề thi AI-103, Microsoft luôn gài yếu tố **'optimize cost while meeting requirements'** (tối ưu chi phí mà vẫn đáp ứng đủ yêu cầu) vào câu hỏi Document Intelligence. Tại sao điều này quan trọng? Vì giá tiền trên mỗi 1.000 trang giữa `prebuilt-read`, `prebuilt-layout` và `prebuilt-invoice` / `custom` chênh lệch nhau đáng kể! Nếu đề bài chỉ cần rút trích chữ thuần túy từ sách scan không có bảng biểu để đếm từ khóa, chọn `prebuilt-read` là kinh tế và chuẩn xác nhất.",
          "Khi tài liệu có chứa **bảng biểu (tables), ô tích chọn (`selection marks` / checkboxes), cấu trúc tiêu đề đoạn văn (`paragraphs` với `role='title' / 'sectionHeading'`)**, em phải nâng lên **`prebuilt-layout`**. Còn nếu bài toán cần lấy ra trực tiếp các trường ngữ nghĩa có sẵn tên chuẩn như `CustomerName`, `InvoiceDate`, `SubTotal`, `TotalTax`, danh sách mặt hàng `Items` trên hóa đơn thương mại hay biên lai bán lẻ, đừng tốn công tự huấn luyện model mới — hãy dùng ngay **`prebuilt-invoice`** hoặc **`prebuilt-receipt`**!"
        ],
        bullets: [
          "**`prebuilt-read`**: OCR thuần túy lấy dòng chữ, từ vựng, ngôn ngữ (hỗ trợ cả chữ in, chữ viết tay trên PDF/ảnh và tệp Office) với chi phí thấp nhất.",
          "**`prebuilt-layout`**: Lấy toàn bộ văn bản + **Tables** (hàng, cột, ô gộp `rowSpan/columnSpan`) + **Selection Marks** (`selected` / `unselected`) + cấu trúc bố cục Markdown.",
          "**Prebuilt Domain Models (`prebuilt-invoice`, `prebuilt-receipt`, `prebuilt-idDocument`, `prebuilt-healthInsuranceCard`...)**: Trích xuất ngay các trường nghiệp vụ chuẩn hóa kèm kiểu dữ liệu tiền tệ/ngày tháng mà không cần gán nhãn huấn luyện.",
          "**Custom Template vs Custom Neural (Cực hay hỏi thi!)**: Cùng huấn luyện tối thiểu từ **5 tài liệu mẫu có gán nhãn**, nhưng **Custom Template** chỉ dành cho biểu mẫu có khung cố định cứng nhắc từng milimet (như tờ khai thuế in sẵn cố định); còn **Custom Neural** vượt trội hoàn toàn khi tài liệu cùng loại nhưng bố cục co giãn khác nhau giữa từng đối tác (như hợp đồng thuê nhà hoặc đơn đặt hàng từ 50 nhà cung cấp khác nhau)!"
        ]
      },
      {
        heading: "2. Xuất định dạng Markdown từ Layout Model: Bí quyết vàng cho RAG trên PDF phức tạp",
        paragraphs: [
          "Thầy muốn chia sẻ với em một kinh nghiệm xương máu từ các dự án RAG ngân hàng: khi người dùng hỏi *'Lãi suất kỳ hạn 12 tháng gửi online cho khách hàng ưu tiên là bao nhiêu?'*, đáp án hầu như luôn nằm trong một **bảng biểu gộp nhiều tầng tiêu đề cột và tiêu đề hàng** của file PDF biểu lãi suất. Nếu em chỉ lấy chuỗi chữ phẳng bình thường, toàn bộ ranh giới hàng – cột biến mất khiến LLM ghép nhầm lãi suất kỳ hạn 6 tháng sang 12 tháng!",
          "Giải pháp hiện đại nhất của SDK `azure-ai-documentintelligence` là gọi mô hình **`prebuilt-layout`** kèm tham số **`output_content_format=DocumentContentFormat.MARKDOWN`**. Dịch vụ sẽ tự động dựng lại toàn bộ tài liệu thành văn bản Markdown sạch đẹp: các tiêu đề chương biến thành `#`, `##`, `###`, các ô tích chọn biến thành `☒` / `☐`, và toàn bộ bảng biểu được định dạng chuẩn cấu trúc bảng để LLM đọc hiểu chính xác từng giao điểm dòng – cột! Sau đó em cắt chunk theo các thẻ tiêu đề Markdown và giữ nguyên khối bảng không bị xé lẻ."
        ],
        bullets: [
          "`prebuilt-layout` xuất Markdown là cầu nối tiêu chuẩn giữa **Azure AI Document Intelligence** và **Azure AI Search** trong các kiến trúc Enterprise RAG của Microsoft.",
          "Với các bảng kéo dài vắt qua 2 trang PDF liên tiếp, kiểm tra thuộc tính `bounding_regions` (số trang `page_number` và đa giác tọa độ `polygon`) để nối liền mạch bảng và dẫn chiếu chính xác trang nguồn khi người dùng bấm vào trích dẫn.",
          "Có thể bật thêm các `DocumentAnalysisFeature` bổ trợ như `OCR_HIGH_RESOLUTION` (cho chữ cực nhỏ trên bản vẽ kỹ thuật), `FORMULAS` (công thức toán học LaTeX) hoặc `BARCODES` (đọc mã QR/mã vạch trên phiếu kho)."
        ]
      },
      {
        heading: "3. Kiểm soát độ tin cậy bằng Confidence Scores: Không nhắm mắt ghi bừa vào ERP!",
        paragraphs: [
          "Khi bóc tách tự động 10.000 tờ hóa đơn chụp bằng điện thoại của nhân viên đi công tác, chắc chắn sẽ có những tờ bị nhăn giấy, lóa đèn flash hoặc nhòe mực làm con số `8` trông giống số `3`. Nếu hệ thống của em cứ lấy thẳng giá trị trích xuất ghi tự động vào phần mềm kế toán SAP/ERP mà không kiểm tra điểm **`confidence`**, sai lệch sổ sách cuối kỳ sẽ cực kỳ tai hại.",
          "Document Intelligence trả về điểm `confidence` (từ `0.0` đến `1.0`) ở **hai cấp độ độc lập**: một là cấp độ từng từ OCR (`word.confidence` trong `pages`), và hai là cấp độ từng trường nghiệp vụ được trích xuất (`field.confidence` trong `documents`). Quy tắc thiết kế chuẩn doanh nghiệp là xây dựng luồng định tuyến theo ngưỡng (**Confidence-based Routing**): chỉ tự động hạch toán thẳng (Straight-Through Processing) khi mọi trường trọng yếu (`InvoiceTotal`, `InvoiceId`, `VendorTaxId`) đều đạt `confidence >= 0.90` VÀ tổng `SubTotal + TotalTax == InvoiceTotal` khớp toán học; bất kỳ trường nào dưới ngưỡng sẽ được khoanh khung màu đỏ trên ảnh gốc bằng tọa độ `polygon` và đẩy sang giao diện kế toán viên xác nhận!"
        ],
        bullets: [
          "Luôn kết hợp **Confidence Score Check** với **Deterministic Business Rules** (kiểm tra công thức cộng ngang cột tiền, định dạng mã số thuế) để đạt độ chính xác tiệm cận 100%.",
          "Sử dụng tọa độ `bounding_regions` (`page_number` + mảng `polygon`) để làm nổi bật ngay ô số liệu đang nghi ngờ trên màn hình review của nhân viên, giúp họ kiểm tra chỉ mất 3 giây thay vì đọc lại cả trang.",
          "Khi cần phân loại một tệp PDF dày 20 trang chứa lẫn cả Hóa đơn, Phiếu giao hàng và CMND gộp chung một file rồi mới gọi đúng model con cho từng trang, hãy sử dụng **Custom Classification model** trong Document Intelligence!"
        ]
      }
    ],
    comparison: {
      title: "Bảng chọn mô hình Azure AI Document Intelligence chuẩn đề thi AI-103",
      headers: ["Mô hình (Model ID)", "Khả năng trích xuất", "Khi nào chọn (Đề thi)", "Lưu ý quan trọng"],
      rows: [
        [
          "`prebuilt-read` (Read)",
          "Văn bản in & viết tay, dòng, từ, ngôn ngữ (không bóc bảng biểu)",
          "Chỉ cần OCR lấy chữ thuần túy từ tài liệu nhiều chữ với chi phí thấp nhất",
          "Không trả về cấu trúc bảng (`tables`) hay ô tích chọn (`selectionMarks`)"
        ],
        [
          "`prebuilt-layout` (Layout)",
          "Văn bản + Bảng biểu + Ô tích chọn + Cấu trúc tiêu đề xuất chuẩn **Markdown**",
          "Tiền xử lý tài liệu PDF phức tạp nhiều bảng biểu trước khi cắt chunk nạp vào RAG",
          "Truyền `output_content_format=DocumentContentFormat.MARKDOWN` để tối ưu cho LLM"
        ],
        [
          "`prebuilt-invoice` / `receipt` / `idDocument`",
          "Các trường khóa-giá trị chuẩn hóa (`InvoiceTotal`, `VendorName`, `Items`...) + `confidence`",
          "Xử lý hóa đơn, biên lai, giấy tờ tùy thân phổ thông ngay lập tức không cần dữ liệu huấn luyện",
          "Luôn kiểm tra `field.confidence` và quy tắc cộng tổng tiền trước khi ghi tự động vào ERP"
        ],
        [
          "Custom Neural vs Custom Template",
          "Các trường nghiệp vụ đặc thù riêng do doanh nghiệp tự gán nhãn (tối thiểu 5 mẫu)",
          "Chọn **Custom Neural** cho tài liệu bố cục biến thiên linh hoạt; **Custom Template** cho biểu mẫu khung cố định cứng",
          "Nếu 1 file PDF gộp lẫn nhiều loại biểu mẫu khác nhau, dùng thêm Custom Document Classifier để tách trang"
        ]
      ]
    },
    codeTitle: "Trích xuất Hóa đơn kiểm tra Confidence Score và Xuất Markdown cho kho RAG",
    code: `import os
from azure.identity import DefaultAzureCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, DocumentContentFormat

doc_client = DocumentIntelligenceClient(
    endpoint=os.environ["DOC_INTEL_ENDPOINT"],
    credential=DefaultAzureCredential()
)

# 1. Trích xuất PDF phức tạp ra định dạng MARKDOWN giữ nguyên bảng biểu phục vụ RAG
with open("credit_policy_tables.pdf", "rb") as pdf_stream:
    layout_poller = doc_client.begin_analyze_document(
        model_id="prebuilt-layout",
        body=pdf_stream,
        output_content_format=DocumentContentFormat.MARKDOWN
    )
rag_markdown_text = layout_poller.result().content
print("Đoạn đầu Markdown cho RAG:\\n", rag_markdown_text[:300])

# 2. Bóc tách Hóa đơn với Prebuilt Invoice và định tuyến theo ngưỡng Confidence Score
with open("vendor_invoice_scan.jpg", "rb") as inv_stream:
    inv_poller = doc_client.begin_analyze_document(model_id="prebuilt-invoice", body=inv_stream)

inv_result = inv_poller.result()
for doc in inv_result.documents:
    total_field = doc.fields.get("InvoiceTotal")
    vendor_field = doc.fields.get("VendorName")
    if not total_field or total_field.confidence < 0.90:
        print(f"[CHỜ NGƯỜI DUYỆT] Độ tin cậy tổng tiền thấp ({getattr(total_field, 'confidence', 0):.2f})")
    else:
        print(f"[TỰ ĐỘNG HẠCH TOÁN] Nhà cung cấp: {vendor_field.content} | Tổng: {total_field.content} (Tin cậy: {total_field.confidence:.2f})")`,
    codeNotes: [
      "Lưu ý tên gói SDK thế hệ mới chuẩn đề thi hiện tại là **`azure-ai-documentintelligence`** (class `DocumentIntelligenceClient`), thay thế cho tên cũ `azure-ai-formrecognizer` trước đây.",
      "Mọi lệnh phân tích tài liệu đều chạy theo mô hình bất đồng bộ Long-Running Operation (`begin_analyze_document` trả về `poller`, gọi `.result()` để nhận kết quả khi xử lý xong) vì một file PDF có thể dài hàng trăm trang.",
      "Ở phần 2, việc kiểm tra `total_field.confidence < 0.90` giúp tự động sàng lọc những hóa đơn chụp mờ sang luồng Human Review thay vì nhập sai con số vào sổ kế toán."
    ],
    labGuide: {
      goal: "Thực hành chuyển đổi tài liệu nhiều bảng biểu sang Markdown cho RAG và xây dựng bộ lọc kiểm định hóa đơn dựa trên điểm Confidence.",
      steps: [
        "Bước 1: Tạo tài nguyên Azure AI Document Intelligence (hoặc Azure AI Services), cấp quyền `Cognitive Services User` cho tài khoản thực hành.",
        "Bước 2: Lấy một file PDF có bảng giá nhiều cột và ô tích chọn, chạy `prebuilt-layout` với `DocumentContentFormat.MARKDOWN` rồi lưu kết quả ra file `output.md` mở trên VS Code xem bảng biểu được giữ nguyên vẹn ra sao.",
        "Bước 3: Chụp 2 bức ảnh hóa đơn mua hàng: 1 tấm rõ nét đủ sáng và 1 tấm cố tình chụp nghiêng thiếu sáng làm mờ dòng tổng tiền; đưa cả hai qua `prebuilt-invoice`.",
        "Bước 4: In toàn bộ tên trường, giá trị chuẩn hóa (`value_currency`), tọa độ `bounding_regions` và `confidence` của cả 2 tấm ảnh để chứng kiến tấm ảnh mờ bị chặn lại chính xác bởi ngưỡng `0.90`."
      ],
      expectedOutput: "File `output.md` tái tạo chính xác bảng biểu cùng các tiêu đề phân cấp sẵn sàng để chunking vào Azure AI Search; tấm hóa đơn rõ nét đi vào nhánh `[TỰ ĐỘNG HẠCH TOÁN]` trong khi tấm hóa đơn mờ tự động rơi vào nhánh `[CHỜ NGƯỜI DUYỆT]`."
    },
    examTips: [
      "Từ khóa đề bài 'preserve complex table structures and section headings from PDF documents for RAG chunking' -> Chọn **Azure AI Document Intelligence `prebuilt-layout` with `MARKDOWN` output format**.",
      "Từ khóa đề bài 'extract custom fields from unstructured contracts or purchase orders whose layouts vary across different vendors' -> Chọn **Custom Neural model** (tuyệt đối không chọn Custom Template vì bố cục biến đổi!).",
      "Từ khóa đề bài 'minimize manual data entry errors when scanning crumpled receipts/invoices' -> Kiểm tra **`confidence` score** ở từng trường và chuyển các bản ghi dưới ngưỡng sang bước đánh giá của con người."
    ],
    summaryTakeaways: [
      "Chọn mô hình đúng tầng nhu cầu để tối ưu chi phí: `Read` cho chữ thuần túy -> `Layout` cho bảng biểu/checkbox/Markdown -> `Prebuilt` cho hóa đơn/CMND phổ thông -> `Custom` cho biểu mẫu đặc thù riêng.",
      "Giữa hai dòng Custom: chọn `Custom Template` cho phôi biểu mẫu cố định vị trí, chọn `Custom Neural` cho tài liệu bán cấu trúc/phi cấu trúc có bố cục linh hoạt.",
      "Xuất định dạng `MARKDOWN` từ `prebuilt-layout` là phương pháp chuẩn mực nhất để không làm vỡ cấu trúc bảng biểu khi nạp dữ liệu PDF vào RAG.",
      "Luôn kiểm tra `field.confidence` kết hợp quy tắc đối soát số học để định tuyến các tài liệu chất lượng thấp sang con người phê duyệt."
    ],
    lessonQuestions: [
      {
        question: "Bạn đang xây dựng đường ống nạp dữ liệu (Ingestion Pipeline) cho hệ thống RAG tư vấn kỹ thuật từ 3.000 cuốn sổ tay PDF chứa rất nhiều bảng thông số kỹ thuật gộp ô và các mục tiêu đề phân cấp. Để LLM hiểu chính xác mối quan hệ dòng – cột của bảng mà không cần huấn luyện mô hình tùy chỉnh, bạn nên dùng cấu hình nào?",
        options: [
          "Dùng `prebuilt-read` xuất chuỗi văn bản phẳng không định dạng.",
          "Dùng Azure AI Document Intelligence `prebuilt-layout` với định dạng đầu ra `DocumentContentFormat.MARKDOWN`, sau đó chia chunk theo cấu trúc tiêu đề Markdown.",
          "Dùng `prebuilt-receipt` cho toàn bộ sổ tay kỹ thuật.",
          "Chỉ chụp ảnh trang bìa rồi dùng Smart Cropping."
        ],
        answer: 1,
        explanation: "Mô hình `prebuilt-layout` khi xuất định dạng `MARKDOWN` giữ nguyên cấu trúc bảng biểu và hệ thống tiêu đề phân cấp (`#`, `##`), giúp quá trình cắt chunk bảo toàn ngữ cảnh bảng để LLM đọc hiểu chính xác từng thông số.",
        wrongReasons: [
          "`prebuilt-read` không trích xuất cấu trúc bảng nên làm trộn lẫn các cột số liệu vào nhau.",
          "",
          "`prebuilt-receipt` được thiết kế riêng cho biên lai mua lẻ chứ không phải sổ tay kỹ thuật.",
          "Chỉ chụp trang bìa bỏ mất toàn bộ nội dung bên trong cuốn sổ tay."
        ]
      },
      {
        question: "Một công ty logistics cần trích xuất 8 trường thông tin đặc thù nội bộ từ các Hợp đồng vận chuyển ký với hơn 200 đối tác khác nhau. Mỗi đối tác trình bày hợp đồng theo phông chữ, độ dài đoạn văn và vị trí bảng biểu hoàn toàn khác nhau, hiện công ty có sẵn 15 hợp đồng mẫu đã gán nhãn. Bạn nên chọn loại mô hình nào trong Document Intelligence?",
        options: [
          "Custom Template model (Mô hình khuôn mẫu cố định).",
          "Prebuilt ID Document model.",
          "Custom Neural model (Mô hình mạng nơ-ron tùy chỉnh).",
          "Azure AI Speech Batch Transcription."
        ],
        answer: 2,
        explanation: "Custom Neural model sử dụng hiểu biết ngữ nghĩa sâu để trích xuất trường tùy chỉnh trên các tài liệu bán cấu trúc hoặc phi cấu trúc (như hợp đồng) có bố cục thay đổi linh hoạt giữa nhiều đối tác khác nhau, và chỉ yêu cầu tối thiểu từ 5 mẫu huấn luyện.",
        wrongReasons: [
          "Custom Template đòi hỏi vị trí khung biểu mẫu cố định đồng nhất, sẽ thất bại khi 200 đối tác dùng 200 bố cục hợp đồng khác nhau.",
          "Prebuilt ID Document chỉ dùng cho hộ chiếu, bằng lái xe, căn cước công dân.",
          "",
          "Speech Batch Transcription dùng cho tệp âm thanh, không đọc được văn bản hợp đồng."
        ]
      }
    ]
  },

  "C6": {
    duration: "60 phút",
    difficulty: "Tổng hợp & Chiến thuật thi (AI-103)",
    teacherIntro: "Chào em, chúc mừng em đã kiên trì đồng hành cùng thầy đi tới bài cuối cùng khép lại nền tảng chứng chỉ **Microsoft Certified: Azure AI Engineer Associate (AI-103)** trước khi bước sang thế giới Đa Tác Tử chuyên sâu của AI-500! Ở các bài lẻ từ A1 tới C5, chúng ta đã rèn từng thanh kiếm riêng biệt: Foundry, RAG, AI Search, Agent Tools, Memory, Workflow, Evaluation, Vision, Language, Speech và Document Intelligence. Nhưng trong cả dự án doanh nghiệp thực tế lẫn các câu hỏi **Case Study dài 2 trang** của kỳ thi AI-103, Microsoft không bao giờ hỏi rời rạc từng mảnh mà bắt em **ghép tất cả lại thành một kiến trúc đầu-cuối (End-to-End Architecture)** chặt chẽ, bảo mật và tối ưu chi phí. Hôm nay thầy sẽ cùng em hệ thống hóa trọn vẹn 5 miền kỹ năng AI-103, dựng một Mini Project Hỏi đáp Đa phương thức hoàn chỉnh và truyền lại toàn bộ bí kíp chiến thuật phòng thi thực chiến!",
    analogy: {
      title: "Nhạc trưởng chỉ huy dàn nhạc giao hưởng và Cuốn cẩm nang tra cứu hợp pháp trong phòng thi",
      body: "Em hãy hình dung ở 17 bài trước, em đã học cách chơi từng nhạc cụ riêng lẻ: đàn dây AI Search, bộ gõ Agent Tools, kèn đồng Document Intelligence, sáo trúc Speech... Sang bài C6 này, em bước lên bục làm **Nhạc trưởng**: biết đúng giây nào gọi Document Intelligence bóc bảng PDF, giây nào cho Language xóa sạch PII, giây nào cho AI Search lọc quyền người dùng rồi giao cho Agent trả lời qua giọng đọc Neural TTS! Và một bí mật tuyệt vời nhiều thí sinh chưa biết: phòng thi chính thức của Microsoft giống như cho phép Nhạc trưởng mang theo cuốn tổng phổ chính thống (**nút tra cứu Microsoft Learn ngay trên màn hình thi**) — nhưng chỉ ai nắm vững bản đồ kiến trúc trong đầu mới biết lật đúng trang trong 30 giây để chốt đáp án 100% chính xác!"
    },
    objectives: [
      "Liên kết mạch lạc toàn bộ 5 miền kỹ năng trọng tâm của đề thi AI-103 thành một bản đồ quyết định chọn dịch vụ không nhầm lẫn.",
      "Thiết kế và hiện thực hóa kiến trúc End-to-End cho Mini Project Trợ lý Hỏi đáp Tài liệu Đa phương thức chuẩn bảo mật doanh nghiệp.",
      "Nắm vững chiến thuật phân bổ thời gian, cách giải quyết câu hỏi Case Study nhiều ràng buộc và kỹ năng tra cứu nhanh Microsoft Learn hợp lệ ngay trong phòng thi."
    ],
    flow: [
      {
        step: "1. Multimodal Ingestion & Extraction (Thu thập & Bóc tách đa phương thức)",
        detail: "PDF bảng biểu qua Document Intelligence (`prebuilt-layout` -> Markdown), ghi âm họp qua Speech Batch Transcription, ảnh hiện trường qua AI Vision (`Dense Captions`) để quy về văn bản có cấu trúc + metadata."
      },
      {
        step: "2. Privacy & Security Indexing (Làm sạch PII & Đánh chỉ mục phân quyền)",
        detail: "Đưa văn bản qua AI Language (`PII Redaction`) ẩn thông tin cá nhân, tạo vector bằng Foundry Embedding và nạp vào Azure AI Search kèm trường ACL `allowed_groups`."
      },
      {
        step: "3. Secure Agentic Orchestration (Điều phối Agent truy xuất & Hành động)",
        detail: "Foundry Agent nhận câu hỏi (chữ hoặc giọng nói), chạy Hybrid + Semantic Search có lọc Security Trimming, gọi OpenAPI/Function Tools tra dữ liệu động và dừng ở HITL Checkpoint nếu cần phê duyệt."
      },
      {
        step: "4. Guardrails, Telemetry & Continuous Evaluation (An toàn, Giám sát & Đánh giá)",
        detail: "Bọc đầu vào/đầu ra bằng Azure AI Content Safety (Prompt Shields + Output Filters), ghi vết OpenTelemetry lên Application Insights và chấm tự động bằng `azure-ai-evaluation`."
      }
    ],
    sections: [
      {
        heading: "1. Tổng kết liên kết 5 miền kỹ năng cốt lõi của kỳ thi AI-103",
        paragraphs: [
          "Đề thi AI-103 được cấu trúc xoay quanh **5 miền kỹ năng lớn** liên thông chặt chẽ với nhau như 5 tầng của một tòa nhà doanh nghiệp. Tầng móng thứ nhất là **Quản trị, Bảo mật & Vận hành nền tảng Azure AI (Plan & Manage)**: dùng Microsoft Foundry quản lý tài nguyên tập trung, xác thực hoàn toàn bằng **Managed Identity + Entra ID RBAC** (nói không với hardcode key trong code sản xuất!), cô lập mạng bằng Private Endpoints, cất bí mật bên thứ ba vào Azure Key Vault, điều tiết hạn mức TPM/PTU qua API Management và theo dõi tracing với Application Insights.",
          "Bốn tầng nghiệp vụ bên trên bao gồm: **(2) Generative AI & RAG** (chọn model, tối ưu prompt, Structured Outputs, RAG với Azure AI Search Hybrid + RRF + Semantic Ranker); **(3) Agentic Solutions** (trang bị Tools OpenAPI/Functions/MCP, quản lý Memory + Cosmos DB TTL, điều phối Workflow Sequential/Parallel/HITL và chấm điểm bằng `azure-ai-evaluation`); **(4) Computer Vision & Image/Video** (Vision 4.0 Caption/Dense Captions/Objects, Multimodal GPT-4o, tạo ảnh + C2PA, hiểu Video); và **(5) NLP, Speech & Document Intelligence** (PII Redaction, Opinion Mining, Custom Classification, STT/TTS/SSML/Voice Consent, Document Intelligence Layout Markdown & Confidence Routing)."
        ],
        bullets: [
          "**Nguyên tắc chọn dịch vụ số 1 của Microsoft**: Ưu tiên dịch vụ dựng sẵn chuyên biệt (Prebuilt AI Services) khi nó giải quyết trọn vẹn bài toán với chi phí thấp và độ trễ nhỏ; chỉ huấn luyện Custom khi dữ liệu mang tính đặc thù nội bộ; và dùng GenAI / Agent khi cần suy luận tổng hợp, sinh nội dung linh hoạt hoặc điều phối công cụ.",
          "**Nguyên tắc bảo mật xuyên suốt**: Phân quyền dữ liệu ở tầng truy xuất (`Security Trimming`), kiểm soát danh tính người gọi ở phía server của Tool (`Least Privilege`), ẩn danh `PII` trước khi lưu log và bọc `Content Safety` cả chiều vào lẫn chiều ra.",
          "**Nguyên tắc chất lượng khả kiểm**: Luôn đi kèm điểm `confidence` (cho trích xuất biểu mẫu) và bộ đánh giá định lượng `Groundedness / Relevance / Safety` trên Golden Dataset 20+ ca kiểm thử (cho GenAI/Agent)."
        ]
      },
      {
        heading: "2. Kiến trúc tham chiếu End-to-End: Trợ lý Hỏi đáp & Xử lý Hồ sơ Đa phương thức",
        paragraphs: [
          "Để em thấy rõ các mảnh ghép phối hợp nhịp nhàng ra sao trong thực tế, hãy cùng thầy duyệt qua kiến trúc Mini Project tổng hợp chuẩn mực cho một **Công ty Bảo hiểm Đa quốc gia**: Khách hàng gửi một bộ hồ sơ yêu cầu bồi thường gồm (1) tờ đơn PDF nhiều bảng chi phí viện phí, (2) ảnh chụp vết xước xe ô tô và (3) đoạn ghi âm trình bày sự việc dài 2 phút bằng tiếng Việt.",
          "Luồng xử lý khép kín chạy như sau: đầu tiên `Azure AI Content Safety` quét ảnh đảm bảo không chứa hình ảnh vi phạm; tiếp theo chạy **song song (Parallel Fan-out)** 3 luồng bóc tách: `Document Intelligence (prebuilt-layout -> Markdown + prebuilt-invoice)` đọc bảng viện phí kèm kiểm tra `confidence >= 0.9`, `Azure AI Vision (Dense Captions)` mô tả từng vùng hư hỏng trên xe kèm tọa độ, và `Azure AI Speech` chuyển đoạn ghi âm thành văn bản. Toàn bộ văn bản gom lại đi qua `Azure AI Language PII Redaction` tạo bản sạch lưu log kiểm toán, đồng thời Agent tra cứu điều khoản hợp đồng qua `Azure AI Search (Hybrid + Semantic Ranker + Security Trimming)`. Cuối cùng, nếu mức bồi thường đề xuất vượt quá 10 triệu đồng, workflow lưu **HITL Checkpoint** trên `Cosmos DB (có bật TTL)` chờ giám định viên bấm duyệt!"
        ],
        bullets: [
          "Mọi kết nối giữa Web App -> Foundry -> AI Search -> Blob Storage -> Cosmos DB đều dùng **System/User-Assigned Managed Identity** thông qua `DefaultAzureCredential`.",
          "Khi trích dẫn câu trả lời cho giám định viên, giao diện hiển thị rõ đoạn điều khoản hợp đồng `[HĐ-Trang 6]`, khung `bounding_box` trên ảnh xe và dấu thời gian `timestamp` trong đoạn ghi âm.",
          "Trước mỗi đợt cập nhật prompt hoặc đổi model, pipeline GitHub Actions chạy `azure-ai-evaluation` trên bộ 30 hồ sơ mẫu `.jsonl`, yêu cầu `Groundedness >= 4.3` mới cho phép triển khai."
        ]
      },
      {
        heading: "3. Chiến thuật phòng thi AI-103 thực chiến: Quản lý thời gian, Case Study & Tra cứu MS Learn",
        paragraphs: [
          "Đi thi chứng chỉ Microsoft Associate (thường khoảng 45–55 câu hỏi trong 100 phút, điểm đậu **700/1000**), kiến thức vững chiếm 75% chiến thắng, còn 25% quyết định nằm ở **chiến thuật làm bài lạnh lùng và tỉnh táo**! Cấu trúc đề thi có 3 vùng đặc biệt em phải hết sức chú ý về luật quay lại: (1) Nhóm câu hỏi tình huống chuỗi giải pháp chung đầu đề (*'Does this meet the goal? Yes / No'*) — một khi đã bấm Next sang câu sau là **KHÔNG ĐƯỢC QUAY LẠI SỬA**; (2) Nhóm trắc nghiệm độc lập, kéo thả thứ tự bước (`Drag & Drop`), điền khuyết đoạn code SDK Python/C#/REST JSON; và (3) Nhóm **1–2 bài Case Study dài** có nhiều tab thông tin riêng biệt.",
          "Mẹo vàng thầy dặn kỹ cho phần **Case Study**: ĐỪNG đọc từ dòng đầu tới dòng cuối của cả 6 tab mô tả công ty trước (em sẽ bị ngợp thông tin và quên sạch sau 3 phút!). Hãy **đọc thẳng câu hỏi và 4 đáp án trước**, gạch chân từ khóa yêu cầu (ví dụ câu hỏi nhắc tới `'compliance requirement for chat logs'`), sau đó mới bấm thẳng vào đúng tab `Security & Compliance Requirements` tìm đúng câu văn chứa ràng buộc đó — trung bình tiết kiệm được 15 phút quý giá! Và nhớ tận dụng nút **Microsoft Learn** tích hợp sẵn trên thanh công cụ phòng thi để tra nhanh tên chính xác của tham số SDK, giới hạn Region hoặc thứ tự thuộc tính JSON khi phân vân giữa 2 đáp án gần giống nhau (nhưng chỉ đánh dấu `Review Later` để tra vào 15 phút cuối, tuyệt đối không sa đà đọc tài liệu quá 2 phút ở một câu làm cháy giờ!)."
        ],
        bullets: [
          "**Phân bổ nhịp độ thời gian**: Trung bình tối đa ~1,5 phút cho câu đơn; dành 12–15 phút cho mỗi Case Study; chừa lại ít nhất 10–12 phút cuối để rà soát các câu đã cắm cờ (`Mark for Review`) và tra cứu nhanh MS Learn.",
          "**Mẹo điền code SDK / REST**: Chú ý kỹ tên hàm bất đồng bộ (`begin_analyze_document`), định dạng xác thực `DefaultAzureCredential()`, cấu trúc OData `search.in(...)` và thứ tự bước `Create Index -> Upload/Index Docs -> Query with Hybrid+Semantic`.",
          "**Không bao giờ bỏ trống câu nào**: Kỳ thi Microsoft KHÔNG trừ điểm câu trả lời sai; nếu gặp câu kéo thả phức tạp chưa chắc chắn 100%, hãy loại trừ phương án vô lý và chọn tổ hợp hợp lý nhất trước khi hết giờ."
        ]
      }
    ],
    comparison: {
      title: "Bảng tổng hợp Phản xạ nhanh Từ khóa Đề thi -> Giải pháp Chuẩn AI-103",
      headers: ["Dấu hiệu / Từ khóa trong đề bài", "Giải pháp chuẩn phải chọn", "Lựa chọn bẫy cần loại ngay", "Miền kiến thức"],
      rows: [
        [
          "Dữ liệu thay đổi liên tục + trích dẫn nguồn + phân quyền tài liệu theo nhóm người dùng",
          "RAG + Azure AI Search (Hybrid + Semantic Ranker + OData Security Trimming)",
          "Fine-tuning hàng tuần hoặc lọc quyền bằng câu dặn trong System Prompt",
          "GenAI & Search (B1, B2)"
        ],
        [
          "Agent gọi REST API sẵn có + dừng xin phép quản lý trước khi hoàn tiền lớn + tự xóa lịch sử sau 30 ngày",
          "OpenAPI Tool (Managed Identity) + HITL Checkpoint + Cosmos DB TTL",
          "Cho LLM tự điền `user_id` quyền Admin hoặc dùng `sleep()` chờ trên HTTP thread",
          "Agentic Solutions (B3–B5)"
        ],
        [
          "Bóc tách PDF nhiều bảng biểu cho RAG + hợp đồng bố cục đa dạng giữa các đối tác + lọc bản mờ",
          "Document Intelligence `prebuilt-layout` (Markdown) + `Custom Neural` + kiểm tra `confidence`",
          "`prebuilt-read` mất bảng biểu hoặc `Custom Template` cho bố cục biến thiên",
          "Document Extraction (C5)"
        ],
        [
          "Mô tả nhiều góc ảnh kèm khung tọa độ + che SĐT/y tế + gỡ băng 10.000 file ghi âm + đọc chậm từng số OTP",
          "Vision `Dense Captions` + Language `PII Redaction` + Speech `Batch Transcription` + TTS `SSML`",
          "`Image Caption` đơn lẻ, `NER` thường không che dấu `*`, hoặc vòng lặp `recognize_once`",
          "Vision, Language & Speech (C1–C4)"
        ]
      ]
    },
    codeTitle: "Mini Project End-to-End: Bóc tách PDF ra Markdown -> Che giấu PII -> Truy vấn Hybrid RAG",
    code: `import os
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentContentFormat
from azure.ai.textanalytics import TextAnalyticsClient
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizableTextQuery, QueryType
from openai import AzureOpenAI

cred = DefaultAzureCredential()

# 1. EXTRACT: Đọc biểu mẫu PDF phức tạp sang chuẩn Markdown giữ nguyên bảng biểu
doc_client = DocumentIntelligenceClient(os.environ["DOC_INTEL_ENDPOINT"], cred)
with open("claim_report.pdf", "rb") as f:
    raw_md = doc_client.begin_analyze_document(
        "prebuilt-layout", body=f, output_content_format=DocumentContentFormat.MARKDOWN
    ).result().content

# 2. SCRUB PII: Ẩn danh thông tin cá nhân nhạy cảm trước khi lưu hoặc đưa vào ngữ cảnh chung
lang_client = TextAnalyticsClient(os.environ["LANGUAGE_ENDPOINT"], cred)
clean_md = lang_client.recognize_pii_entities([raw_md[:5000]], language="vi")[0].redacted_text

# 3. SECURE HYBRID RETRIEVAL: Tra cứu quy định bồi thường với RRF + Semantic Ranker + Security Filter
search_client = SearchClient(os.environ["AZURE_SEARCH_ENDPOINT"], "claims-policy-idx", cred)
hits = search_client.search(
    search_text="mức trần bồi thường kính chắn gió ô tô",
    vector_queries=[VectorizableTextQuery(text="bồi thường vỡ kính xe", k_nearest_neighbors=30, fields="vec")],
    filter="allowed_groups/any(g: search.in(g, 'claims-adjusters', ','))",
    query_type=QueryType.SEMANTIC,
    semantic_configuration_name="sem-cfg",
    top=3
)
policy_ctx = "\\n".join([f"[{h['doc_id']}]: {h['chunk_text']}" for h in hits])

# 4. GROUNDED SYNTHESIS: Tổng hợp đề xuất có trích dẫn nguồn dựa trên hồ sơ sạch & quy định
aoai = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=get_bearer_token_provider(cred, "https://cognitiveservices.azure.com/.default"),
    api_version="2024-10-21"
)
ans = aoai.chat.completions.create(
    model="gpt-4o-mini",
    temperature=0.0,
    messages=[
        {"role": "system", "content": "Đối chiếu hồ sơ với quy định được cung cấp, đính kèm mã [doc_id]. Nếu vượt 10 triệu VND, gắn cờ [CẦN_PHÊ_DUYỆT_HITL]."},
        {"role": "user", "content": f"Hồ sơ đã ẩn PII:\\n{clean_md}\\n\\nQuy định:\\n{policy_ctx}"}
    ]
)
print(ans.choices[0].message.content)`,
    codeNotes: [
      "Chỉ với một đối tượng `cred = DefaultAzureCredential()` duy nhất ở đầu chương trình, ứng dụng xác thực xuyên suốt cả 4 dịch vụ (`DocumentIntelligenceClient`, `TextAnalyticsClient`, `SearchClient`, `AzureOpenAI`) không hề lộ bất kỳ một API Key nào!",
      "Đoạn code thể hiện rõ chuỗi mắt xích kiến trúc chuẩn đề thi AI-103: `Document Intelligence (Markdown)` -> `Language (PII Redaction)` -> `AI Search (Hybrid + Semantic + Security Filter)` -> `Foundry OpenAI (Grounded Synthesis + HITL Flag)`.",
      "Lưu ý giới hạn ký tự trên mỗi document khi gọi `recognize_pii_entities` (thường tối đa ~5.120 ký tự/document); với file Markdown dài nhiều trang, hãy cắt thành từng đoạn chunk trước rồi truyền cả mảng đoạn văn vào 1 batch!"
    ],
    labGuide: {
      goal: "Ghép nối thành công Mini Project hỏi đáp và thẩm định hồ sơ đa phương thức đầu-cuối, sẵn sàng tự tin bước vào kỳ thi thử AI-103.",
      steps: [
        "Bước 1: Kiểm tra phân quyền RBAC đồng bộ cho tài khoản thực hành trên cả Microsoft Foundry, Azure AI Services (Vision, Language, Speech, Document Intelligence) và Azure AI Search.",
        "Bước 2: Đưa 1 file PDF hóa đơn/báo cáo hư hỏng xe (có ghi tên + SĐT khách hàng giả lập và bảng chi phí sửa chữa 15.000.000 VND) chạy qua Bước 1 & Bước 2 của script để kiểm chứng bảng biểu ra chuẩn Markdown và SĐT đã được che thành `**********`.",
        "Bước 3: Chạy tiếp Bước 3 & Bước 4 kết nối với Index quy định bảo hiểm đã tạo ở bài B2, xác nhận câu trả lời vừa trích dẫn đúng mã điều khoản `[doc_id]`, vừa gắn cờ `[CẦN_PHÊ_DUYỆT_HITL]` do tổng chi phí > 10 triệu VND.",
        "Bước 4: Tạo bộ 20 câu hỏi kiểm thử phủ khắp quy trình này và chạy `azure-ai-evaluation` (bài B6) để chốt bảng điểm tổng kết sẵn sàng cho bài thi thử toàn khóa!"
      ],
      expectedOutput: "Hệ thống chạy trơn tru từ file PDF thô đến kết luận thẩm định có trích dẫn nguồn, ẩn sạch 100% thông tin cá nhân nhạy cảm, kích hoạt đúng cờ chờ người duyệt cho khoản chi lớn và đạt điểm Groundedness >= 4.2/5 trên tập test."
    },
    examTips: [
      "Khi làm câu hỏi **Case Study**, luôn đọc câu hỏi trước rồi mới mở đúng tab chứa yêu cầu đó (`Technical Requirements` / `Security Requirements`), chú ý từng từ ràng buộc như `'must minimize development effort'`, `'no sensitive data stored'` hay `'sub-second latency'`.",
      "Cẩn thận với nhóm câu hỏi kịch bản đầu đề không cho quay lại (`Yes / No` series): đọc thật kỹ xem giải pháp đề xuất có thỏa mãn ĐỦ TẤT CẢ các yêu cầu phụ (ví dụ vừa đúng độ chính xác vừa đúng bảo mật Managed Identity) hay không trước khi bấm Next.",
      "Sử dụng tính năng tìm kiếm trên tab **Microsoft Learn** trong phòng thi một cách chiến thuật: chỉ cắm cờ những câu phân vân tên class/tham số SDK cụ thể để tra cứu dứt điểm ở 10–15 phút cuối giờ."
    ],
    summaryTakeaways: [
      "Sức mạnh thực sự của Kỹ sư Azure AI nằm ở khả năng kết hợp đúng vai trò từng dịch vụ: trích xuất chuẩn bằng Document Intelligence/Speech/Vision, làm sạch bằng Language/Content Safety, truy xuất phân quyền bằng AI Search và suy luận hành động bằng Foundry Agent.",
      "Bốn trụ cột phi chức năng luôn quyết định đáp án đúng trong đề thi: Xác thực không mật khẩu (Managed Identity), Bảo mật dữ liệu (Security Trimming & PII Redaction), Con người kiểm soát rủi ro (Confidence Check & HITL) và Đánh giá định lượng (Evaluation SDK).",
      "Trong phòng thi AI-103, hãy đọc câu hỏi trước khi lội vào văn bản Case Study dài, kiểm soát chặt đồng hồ ~1.5 phút/câu đơn và tận dụng khéo léo tài liệu Microsoft Learn ở cuối giờ.",
      "Hoàn thành vững chắc nền tảng AI-103 từ Học phần A đến C chính là bệ phóng hoàn hảo để em tự tin chinh phục các kiến trúc Đa Tác Tử chuyên sâu ở các học phần AI-500 tiếp theo!"
    ],
    lessonQuestions: [
      {
        question: "Một tập đoàn luật triển khai hệ thống trợ lý AI đọc hàng chục nghìn hợp đồng scan nhiều bảng biểu phức tạp, ẩn danh thông tin cá nhân của thân chủ trước khi lập chỉ mục, cho phép luật sư tìm kiếm chính xác cả số hiệu điều luật lẫn khái niệm pháp lý tương đồng theo đúng phân quyền từng vụ án, và tự động kiểm tra xem AI có bịa đặt thông tin ngoài hợp đồng hay không trước khi phát hành. Tổ hợp kiến trúc nào đáp ứng đầy đủ và chuẩn xác nhất mọi yêu cầu trên?",
        options: [
          "Azure AI Vision Smart Cropping + Keyword Search thuần túy + Fine-tuning hàng ngày + FluencyEvaluator.",
          "Document Intelligence (`prebuilt-layout` xuất Markdown) + Azure AI Language (`PII Redaction`) + Azure AI Search (`Hybrid + Semantic Ranker + Security Trimming`) + Foundry OpenAI & `GroundednessEvaluator`.",
          "Document Intelligence (`prebuilt-read`) + Lưu toàn bộ văn bản thô không lọc quyền vào System Prompt + Speech TTS.",
          "Custom Template cho mọi hợp đồng bất kỳ + Tắt toàn bộ Content Safety để tăng tốc độ."
        ],
        answer: 1,
        explanation: "Tổ hợp này khớp chính xác từng mắt xích: `prebuilt-layout` (Markdown) giữ nguyên bảng biểu hợp đồng scan; `PII Redaction` ẩn thông tin cá nhân thân chủ; `AI Search Hybrid + Semantic + Security Trimming` đáp ứng cả tìm mã điều luật lẫn ngữ nghĩa theo đúng phân quyền vụ án; và `GroundednessEvaluator` đo lường trực tiếp hiện tượng bịa đặt ngoài ngữ cảnh.",
        wrongReasons: [
          "Smart Cropping không đọc được hợp đồng, Keyword Search bỏ sót khái niệm đồng nghĩa và FluencyEvaluator không phát hiện được lỗi bịa đặt thông tin.",
          "",
          "`prebuilt-read` làm vỡ bảng biểu và nhét hàng chục nghìn hợp đồng vào System Prompt là bất khả thi cũng như vi phạm phân quyền.",
          "Custom Template thất bại với hợp đồng bố cục đa dạng và tắt Content Safety vi phạm nguyên tắc an toàn doanh nghiệp."
        ]
      },
      {
        question: "Trong quá trình làm bài thi chứng chỉ AI-103, bạn gặp một Case Study gồm 6 tab mô tả rất dài kèm 5 câu hỏi trắc nghiệm và còn 28 phút trên đồng hồ cho 12 câu cuối cùng. Chiến thuật xử lý nào dưới đây hiệu quả và an toàn nhất?",
        options: [
          "Đọc thuộc lòng từng chữ của cả 6 tab từ đầu đến cuối mất 20 phút rồi mới bắt đầu xem câu hỏi đầu tiên.",
          "Mở công cụ tra cứu Microsoft Learn đọc hết toàn bộ tài liệu hướng dẫn Python SDK từ chương 1 trong 25 phút.",
          "Đọc câu hỏi và các phương án trước để xác định từ khóa ràng buộc, nhảy thẳng tới tab liên quan trong Case Study để đối chiếu, chọn đáp án chắc chắn nhất cho mọi câu và cắm cờ tra nhanh MS Learn ở vài phút dư cuối cùng.",
          "Bỏ trống không chọn các câu khó để tránh bị trừ điểm âm."
        ],
        answer: 2,
        explanation: "Đọc câu hỏi trước giúp định vị mục tiêu tìm kiếm ngay lập tức trong tab tương ứng của Case Study mà không bị quá tải thông tin; đồng thời kỳ thi không trừ điểm câu sai nên luôn chọn đáp án tốt nhất trước rồi mới dùng thời gian dư cuối giờ để tra cứu xác nhận những chi tiết nhỏ trên Microsoft Learn.",
        wrongReasons: [
          "Đọc lan man toàn bộ 6 tab trước gây lãng phí thời gian nghiêm trọng và khiến bạn không kịp làm các câu còn lại.",
          "Sa đà đọc tài liệu dài trên MS Learn sẽ làm hết sạch giờ thi trước khi kịp trả lời câu hỏi.",
          "",
          "Đề thi Microsoft không có điểm âm cho câu sai; bỏ trống đồng nghĩa với tự đánh mất cơ hội ghi điểm."
        ]
      }
    ]
  }
});
