import noteModel from "../models/Note.js";
import user from "../routes/user-route.js";

export const createNote = async (req, res) => {
  const userId = req.user.id;
  const { title, description } = req.body;
  const newNote = new noteModel({
    title: title,
    description: description,
    userId: userId,
  });

  try {
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const newNote = {
    title: title,
    description: description,
    userId: req.user.id,
  };

  try {
    const existingNote = await noteModel.findById(id);
    if (!existingNote) {
        return res.status(404).json({ message: "Note not found" });
    }
    if (existingNote.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot update this note" });
    }
    await noteModel.findByIdAndUpdate(id, newNote, { new: true,});
    res.status(200).json({ message: "Note updated successfully", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteNote = async (req, res) => {
  const id = req.params.id;
  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this note" });
    }
    await noteModel.findByIdAndDelete(id);
    res.status(202).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getNotes = async (req, res) => {
  try {
    // page & limit query 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Total notes count
    const totalNotes = await noteModel.countDocuments({
      userId: req.user.id
    });

    // paginated notes
    const notes = await noteModel
      .find({ userId: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notes fetched successfully",
      page,
      limit,
      totalNotes,
      totalPage: Math.ceil(totalNotes / limit),
      notes: notes
    })
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// export const getNotes = async (req, res) => {
//   try {
//     const notes = await noteModel.find({ userId: req.user.id });
//     res
//       .status(200)
//       .json({ message: "Notes fetched successfully", notes: notes });
//   } catch (error) {
//     console.error("Error creating note:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const getNoteById = async (req, res) => {
  const id = req.params.id;
  try {
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note fetched successfully", note: note });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
