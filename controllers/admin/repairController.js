const Repair = require('../../models/Repair');

/*
|--------------------------------------------------------------------------
| Analytics Helper (Used by ALL routes)
|--------------------------------------------------------------------------
*/
function buildAnalytics(repairs) {
  // Overview Stats
  const stats = {
    total: repairs.length,
    active: repairs.filter(r => r.status !== "Completed").length,
    completed: repairs.filter(r => r.status === "Completed").length,
    diagnostic: repairs.filter(r => r.status === "Diagnostic").length,
  };

  // Monthly Chart Data
  const monthlyCounts = new Array(12).fill(0);
  repairs.forEach(r => {
    const m = new Date(r.createdAt).getMonth();
    monthlyCounts[m]++;
  });

  // Status Breakdown Chart
  const statusCounts = {
    Diagnostic: 0,
    "In Progress": 0,
    "Finishing Up": 0,
    Completed: 0
  };

  repairs.forEach(r => {
    if (statusCounts[r.status] !== undefined) {
      statusCounts[r.status]++;
    }
  });

  return { stats, monthlyCounts, statusCounts };
}

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Dashboard (GET)
  |--------------------------------------------------------------------------
  */
  getIndex: async (req, res) => {
    try {
      const allRepairs = await Repair.find().sort({ createdAt: -1 });
      const activeRepairs = allRepairs.filter(r => r.status !== "Completed");

      const analytics = buildAnalytics(allRepairs);

      res.render("admin/dashboard.ejs", {
        user: req.user,
        repairs: activeRepairs,
        error: null,
        searchMode: false,
        ...analytics
      });

    } catch (err) {
      console.error(err);
      res.render("admin/dashboard.ejs", {
        user: req.user,
        repairs: [],
        error: "Could not load repairs.",
        searchMode: false
      });
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Add Job (POST)
  |--------------------------------------------------------------------------
  */
  postAddJob: async (req, res) => {
    try {
      await Repair.create({
        customerName: req.body.customerName,
        phoneNumber: req.body.phoneNumber.replace(/\D/g, ""),
        vin: req.body.vin,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        dateBroughtIn: req.body.dateBroughtIn,
      });

      res.redirect('/admin/dashboard');

    } catch (err) {
      console.error('❌ Error saving job:', err.message);

      let message = 'Failed to add repair job.';
      if (err.code === 11000) {
        message = `A repair with VIN "${req.body.vin}" already exists.`;
      }

      const repairs = await Repair.find({ status: { $ne: 'Completed' } })
        .sort({ updatedAt: -1 });

      const analytics = buildAnalytics(repairs);

      res.render('admin/dashboard.ejs', {
        user: req.user,
        repairs,
        error: message,
        searchMode: false,
        ...analytics
      });
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Update Job Status (POST)
  |--------------------------------------------------------------------------
  */
  updateJobStatus: async (req, res) => {
    try {
      await Repair.findByIdAndUpdate(req.params.id, { status: req.body.status });
      res.redirect('/admin/dashboard');

    } catch (err) {
      console.error('❌ Error updating status:', err.message);

      const repairs = await Repair.find().sort({ createdAt: -1 });
      const analytics = buildAnalytics(repairs);

      res.render('admin/dashboard.ejs', {
        user: req.user,
        repairs,
        error: 'Failed to update job status.',
        searchMode: false,
        ...analytics
      });
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Search Jobs (GET)
  |--------------------------------------------------------------------------
  */
  searchJobs: async (req, res) => {
    try {
      const { customerName, phoneNumber, vin, status } = req.query;

      let query = {};

      if (customerName)
        query.customerName = { $regex: customerName, $options: "i" };

      if (phoneNumber) {
        const cleanedPhone = phoneNumber.replace(/\D/g, "");
        query.phoneNumber = { $regex: cleanedPhone };
      }

      if (vin)
        query.vin = { $regex: vin, $options: "i" };

      if (status)
        query.status = status;

      const repairs = await Repair.find(query).sort({ dateBroughtIn: -1 });

      const analytics = buildAnalytics(repairs);

      res.render("admin/dashboard.ejs", {
        user: req.user,
        repairs,
        error: null,
        searchMode: true,
        ...analytics
      });

    } catch (err) {
      console.error("Search Error:", err);
      res.status(500).send("Search failed.");
    }
  },

  /*
|--------------------------------------------------------------------------
| Print Job Summary (GET)
|--------------------------------------------------------------------------
*/
  // GET /admin/print/:id
printJob: async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);

    if (!repair) {
      return res.status(404).send("Job not found.");
    }

    res.render("admin/print-job.ejs", {
      repair,
      notes: repair.notes,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Print error:", err);
    res.status(500).send("Failed to load print view.");
  }
},

/*
|--------------------------------------------------------------------------
| Get Notes (JSON)
|--------------------------------------------------------------------------
*/
getNotesJSON: async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id).lean();

    if (!repair) {
      return res.status(404).json({ error: "Repair not found" });
    }

    res.json(repair.notes || []);

  } catch (err) {
    console.error("❌ Error loading notes:", err);
    res.status(500).json({ error: "Server error" });
  }
},
};