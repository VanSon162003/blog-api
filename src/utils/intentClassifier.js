const openai = require("./openai");

async function intentClassifier(messages) {
    const recentMessages = messages;

    const systemPrompt = `
        Nhiệm vụ duy nhất của bạn là xác định ý định/mong muốn của khách hàng dựa trên tối đa 5 tin nhắn gần nhất, được cung cấp theo trình tự từ cũ đến mới. Trả về DUY NHẤT tên pattern của agent phù hợp nhất (VD: content.search), không kèm ký tự nào khác.

        Danh sách agents:
        - content.search
        - tutorial.assist
        - qa.expert
        - feedback.engage
        - news.update
        - nav.support
        - default

        Hướng dẫn phân loại ý định:
        - Đọc tin nhắn từ cũ đến mới, ưu tiên ý định thể hiện trong tin nhắn mới nhất nếu có mâu thuẫn.
        - Chỉ chọn một agent dựa trên ý định rõ ràng nhất.

        Tiêu chí chọn agent:
        - content.search: Khách hàng muốn tìm bài viết, tài liệu, hoặc thông tin tổng quát về phát triển web. Từ khóa: "tìm bài viết", "tài liệu về React", "SEO là gì", "UX design".
        - tutorial.assist: Khách hàng yêu cầu hướng dẫn từng bước, ví dụ code, hoặc cách thực hiện cụ thể. Từ khóa: "hướng dẫn", "cách làm", "viết code React", "React Hooks example".
        - qa.expert: Khách hàng hỏi câu hỏi kỹ thuật cụ thể, thường liên quan đến debug, tối ưu, hoặc giải pháp kỹ thuật. Từ khóa: "tại sao code lỗi", "tối ưu React", "fix bug".
        - feedback.engage: Khách hàng đưa ý kiến, bình luận, hoặc đề xuất về nội dung blog. Từ khóa: "bài viết hay", "nên thêm", "đề xuất", "phản hồi".
        - news.update: Khách hàng muốn biết tin tức mới nhất hoặc cập nhật về công nghệ web. Từ khóa: "React 19", "cập nhật mới", "tin tức web dev".
        - nav.support: Khách hàng cần hướng dẫn cách tìm kiếm hoặc điều hướng trên blog. Từ khóa: "tìm chủ đề", "truy cập bài viết", "blog có mục nào".
        - default: Khi ý định không rõ ràng, không liên quan đến phát triển web, hoặc không khớp với agent nào.

        Ví dụ minh họa:
        1. Tin nhắn: "Tôi muốn tìm bài viết về SEO" → content.search
        2. Tin nhắn: "Làm sao để dùng useState trong React?" → tutorial.assist
        3. Tin nhắn: "Code React của tôi bị lỗi render, giúp tôi fix" → qa.expert
        4. Tin nhắn: "Bài viết về UX của bạn rất hay, nên thêm ví dụ" → feedback.engage
        5. Tin nhắn: "Có gì mới trong React 19?" → news.update
        6. Tin nhắn: "Làm sao để tìm các bài viết về React trên blog?" → nav.support
        7. Tin nhắn: "Thời tiết hôm nay thế nào?" → default

        Các tin nhắn gần đây của khách hàng:
    `;
    const result = await openai.send({
        model: "gpt-4o-mini",
        temperature: 0.3,
        input: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...recentMessages,
        ],
    });

    return result.trim();
}

module.exports = intentClassifier;
