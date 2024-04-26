// index.js

document.addEventListener("DOMContentLoaded", function() {
  // 등록 버튼 클릭 이벤트 처리
  document.getElementById("submitButton").addEventListener("click", function(event) {
    event.preventDefault(); // 기본 동작(페이지 새로고침) 방지

    // 입력된 데이터 가져오기
    const itemName = document.getElementById("itemName").value;
    const quantity = document.getElementById("quantity").value;
    const memo = document.getElementById("memo").value;

    // 서버로 데이터 전송
    fetch("/addItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ itemName, quantity, memo })
    })
    .then(response => response.json())
    .then(data => {
      // 서버에서 받은 응답에 따라 처리하는 코드
      console.log(data);

      // 받은 재고 리스트를 화면에 표시
      const inventoryList = document.getElementById("inventoryList");
      inventoryList.innerHTML = ""; // 이전 목록 삭제
      data.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `품명: ${item.itemName}, 수량: ${item.quantity}, 메모: ${item.memo}`;
        inventoryList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error("Error submitting data:", error);
    });
  });

  // 페이지 로드 시 서버로부터 재고 리스트 가져와서 화면에 표시
  fetch("/getInventory")
    .then(response => response.json())
    .then(data => {
      const inventoryList = document.getElementById("inventoryList");
      data.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `품명: ${item.itemName}, 수량: ${item.quantity}, 메모: ${item.memo}`;
        inventoryList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error("Error fetching inventory:", error);
    });
});
