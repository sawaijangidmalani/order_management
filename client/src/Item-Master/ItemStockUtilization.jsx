import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import "../Style/ItemStockUtilization.css";

const Modal = styled.div`
  position: relative;
  z-index: 100;
  top: 25%;
  left: 25%;
  width: 800px;
  border-radius: 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background-color: #f5f8f9;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const HeadTr = styled(Tr)`
  background-color: #5c9c5e;
  color: white;
`;

function ItemStockUtilization({
  selectedItemName1,
  currentData,
  setShowStock,
  itemPriceData,
}) {
  const navigate = useNavigate();
  const [utilizationData, setUtilizationData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedItemData = currentData.filter(
    (item) => item.Name === selectedItemName1
  );

  const fetchItemPrices = async (itemId) => {
    try {
      setIsLoading(true);
      if (itemPriceData && itemPriceData.length > 0) {
        const enrichedStockData = itemPriceData.map((priceItem) => ({
          ...priceItem,
          UnitName: selectedItemData[0]?.UnitName || "N/A",
          TotalQty: parseFloat(priceItem.Qty) || 0,
        }));
        setStockData(enrichedStockData);
      } else {
        const response = await axios.get(
          `https://order-management-mnty.onrender.com/itemPrice/getItemPrices/${itemId}`
        );
        const enrichedStockData = response.data.map((priceItem) => ({
          ...priceItem,
          UnitName: selectedItemData[0]?.UnitName || "N/A",
          TotalQty: parseFloat(priceItem.Qty) || 0,
        }));
        setStockData(enrichedStockData);
      }
    } catch (error) {
      console.error("Error fetching item prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUtilizationData = async (itemId) => {
    try {
      setIsLoading(true);

      const utilResponse = await axios.get(
        `https://order-management-mnty.onrender.com/po/getpurchaseorderitems?itemId=${itemId}`
      );

      const poResponse = await axios.get("https://order-management-mnty.onrender.com/po/getpo");
      const purchaseOrders = poResponse.data;

      const enrichedUtilData = utilResponse.data.data
        .filter((item) => item.ItemID === itemId)
        .map((utilItem) => {
          const matchingPO = purchaseOrders.find(
            (po) => po.PurchaseOrderID === utilItem.PurchaseOrderID
          );

          return {
            ...utilItem,
            quantity: parseFloat(utilItem.AllocatedQty) || 0,
            poDate: utilItem.InvoiceDate || new Date().toISOString(),
            purchaseOrder: matchingPO?.PurchaseOrderNumber || "N/A",
            unit: selectedItemData[0]?.UnitName || "N/A",
          };
        });

      setUtilizationData(enrichedUtilData);
    } catch (error) {
      console.error("Error fetching utilization data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItemData.length > 0) {
      const itemId = selectedItemData[0].ItemID;
      if (itemId) {
        fetchItemPrices(itemId);
        fetchUtilizationData(itemId);
      }
    }
  }, [selectedItemName1, itemPriceData]);

  const totalStock = stockData.reduce(
    (acc, curr) => acc + (curr.TotalQty || 0),
    0
  );

  const totalUtilized = utilizationData.reduce(
    (acc, curr) => acc + (curr.quantity || 0),
    0
  );

  const availableStock = totalStock - totalUtilized;

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const brandName = selectedItemData[0]?.Brand || "N/A";

  return (
    <div className="styled-model">
      <Modal>
        <div className="Styled-Div">
          <h2 style={{ textAlign: "center" }}>Item Stock Utilization</h2>

          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : (
            <>
              <div className="StyledItem">
                <span>
                  Item Name:{" "}
                  <span style={{ fontWeight: "bold", color: "#124E66" }}>
                    {selectedItemName1}
                  </span>
                </span>
                <span>
                  Item Category:{" "}
                  <span style={{ fontWeight: "bold", color: "#124E66" }}>
                    {selectedItemData[0]?.Category}
                  </span>
                </span>
                <span>
                  Brand:{" "}
                  <span style={{ fontWeight: "bold", color: "#124E66" }}>
                    {brandName}
                  </span>
                </span>
              </div>

              <div className="StyledItem">
                <div>
                  <h4>Item Stock</h4>
                  <Table>
                    <thead>
                      <HeadTr>
                        <Th>Date</Th>
                        <Th>Qty</Th>
                        <Th>Unit</Th>
                        <Th>Purchase Price</Th>
                      </HeadTr>
                    </thead>
                    <tbody>
                      {stockData.length > 0 ? (
                        stockData.map((item) => (
                          <Tr key={item.ItemStockID}>
                            <Td>{formatDate(item.PurchaseDate)}</Td>
                            <Td>{item.TotalQty}</Td>
                            <Td>{item.UnitName || "N/A"}</Td>
                            <Td>{item.PurchasePrice}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={4} style={{ textAlign: "center" }}>
                            No stock data available
                          </Td>
                        </Tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                <div>
                  <h4>Item Utilization</h4>
                  <Table>
                    <thead>
                      <HeadTr>
                        <Th>PO Date</Th>
                        <Th>Qty</Th>
                        <Th>Unit</Th>
                        <Th>Purchase Order</Th>
                      </HeadTr>
                    </thead>
                    <tbody>
                      {utilizationData.length > 0 ? (
                        utilizationData.map((stock, index) => (
                          <Tr
                            key={stock.PurchaseOrderItemID || `util-${index}`}
                          >
                            <Td>{formatDate(stock.poDate)}</Td>
                            <Td>{stock.quantity}</Td>
                            <Td>{stock.unit}</Td>
                            <Td>{stock.purchaseOrder}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={4} style={{ textAlign: "center" }}>
                            No utilization data available
                          </Td>
                        </Tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="StyledItem">
                <span>Total Item Stock: {totalStock}</span>
                <span>Item Utilization: {totalUtilized}</span>
                <span>Available Stock: {availableStock}</span>
                <button className="btns" onClick={() => setShowStock(false)}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ItemStockUtilization;
