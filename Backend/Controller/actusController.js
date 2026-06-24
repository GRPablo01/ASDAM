const Actus = require('../Schema/Actus');

// ======================================================
// CREATE ACTUS
// ======================================================
exports.createActus = async (req, res) => {
  try {
    console.log('📥 CREATE ACTUS BODY:', req.body);
    console.log('📁 CREATE ACTUS FILE:', req.file);

    const {
      titre,
      description,
      auteur,
      categorie,
    } = req.body;

    let image = '';

    // 🖼️ IMAGE UPLOAD (Multer)
    if (req.file) {
      image = req.file.filename;
      console.log('🖼️ Image fichier:', image);
    }

    const newActus = new Actus({
      titre,
      description,
      image,
      auteur: auteur || 'admin',
      categorie: categorie || 'general',
    });

    const saved = await newActus.save();

    console.log('✅ ACTUS CREATED:', saved);

    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ CREATE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// GET ALL ACTUS
// ======================================================
exports.getAllActus = async (req, res) => {
  try {
    console.log('📥 GET ALL ACTUS');

    const actus = await Actus.find().sort({ createdAt: -1 });

    res.json(actus);
  } catch (error) {
    console.error('❌ GET ALL ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// GET ACTUS BY ID (+ VUE SIMPLE OPTIONNEL)
// ======================================================
exports.getActusById = async (req, res) => {
  try {
    console.log('📥 GET ACTUS BY ID:', req.params.id);

    const actus = await Actus.findById(req.params.id);

    if (!actus) {
      return res.status(404).json({ message: 'Actus non trouvée' });
    }

    res.json(actus);
  } catch (error) {
    console.error('❌ GET BY ID ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// UPDATE ACTUS
// ======================================================
exports.updateActus = async (req, res) => {
  try {
    console.log('✏️ UPDATE ACTUS:', req.params.id);

    const updateData = { ...req.body };

    // 🖼️ IMAGE UPDATE
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Actus.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Actus non trouvée' });
    }

    console.log('✅ ACTUS UPDATED');

    res.json(updated);
  } catch (error) {
    console.error('❌ UPDATE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ======================================================
// DELETE ACTUS
// ======================================================
exports.deleteActus = async (req, res) => {
  try {
    console.log('🗑️ DELETE ACTUS:', req.params.id);

    const deleted = await Actus.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Actus non trouvée' });
    }

    res.json({ message: 'Actus supprimée avec succès' });
  } catch (error) {
    console.error('❌ DELETE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};