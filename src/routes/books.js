import express from "express";

const router = express.Router();
router.get("/search", (req, res) => {
  res.json({
    books: [
      {
        goodreadsId: 1,
        title: "Conman Autobiography",
        authors: "Chiranjibi",
        covers: [
          "https://picsum.photos/id/781/200/200",
          "https://picsum.photos/id/368/200/200"
        ],
        pages: 200
      },
      {
        goodreadsId: 2,
        title: "Bio of Chiran",
        authors: "Chiranjibi",
        covers: [
          "https://picsum.photos/id/781/200/200",
          "https://picsum.photos/id/368/200/200"
        ],
        pages: 300
      }
    ]
  });
});

export default router;
