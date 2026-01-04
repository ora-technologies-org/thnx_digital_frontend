import React from "react";
import { GiftCard } from "../types";
import "./Modal.css";

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: GiftCard;
}

const GiftCardModal: React.FC<GiftCardModalProps> = ({
  isOpen,
  onClose,
  card,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const expiryDate = new Date(card.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{card.title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="card-details-grid">
            <div className="detail-item">
              <label>Price</label>
              <div className="detail-value price-value">
                ₹{parseFloat(card.price).toLocaleString()}
              </div>
            </div>

            <div className="detail-item">
              <label>Expiry Date</label>
              <div className="detail-value">
                {expiryDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="expiry-info">
                {daysUntilExpiry > 0 ? (
                  <span className="expiry-warning">
                    Expires in {daysUntilExpiry} day
                    {daysUntilExpiry !== 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="expired">Expired</span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <label>Status</label>
              <div className="detail-value">
                <span
                  className={`status-badge ${card.isActive ? "active" : "inactive"}`}
                >
                  {card.isActive ? "Available for Purchase" : "Not Available"}
                </span>
              </div>
            </div>

            <div className="detail-item full-width">
              <label>Description</label>
              <div className="detail-value description">
                {card.description || "No description provided."}
              </div>
            </div>

            <div className="detail-item">
              <label>Created On</label>
              <div className="detail-value">
                {new Date(card.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="detail-item">
              <label>Last Updated</label>
              <div className="detail-value">
                {new Date(card.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {card.isActive && (
            <button className="btn btn-primary">Purchase Gift Card</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftCardModal;
