import { validationResult } from 'express-validator';
import Application, { STATUSES } from '../models/Application.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const getApplications = catchAsync(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = { user: req.user._id };

  if (status && STATUSES.includes(status)) query.status = status;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [applications, total] = await Promise.all([
    Application.find(query).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
    Application.countDocuments(query),
  ]);

  res.json({ applications, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const createApplication = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const app = await Application.create({ ...req.body, user: req.user._id });
  res.status(201).json({ application: app });
});

export const getApplication = catchAsync(async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.json({ application: app });
});

export const updateApplication = catchAsync(async (req, res) => {
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.json({ application: app });
});

export const deleteApplication = catchAsync(async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

export const updateStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(422).json({ message: 'Invalid status' });

  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      status,
      $push: { timeline: { event: `Status changed to ${status}` } },
    },
    { new: true, runValidators: true }
  );
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.json({ application: app });
});

export const getStats = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [byStatus, thisWeek, perWeek] = await Promise.all([
    Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Application.countDocuments({ user: userId, createdAt: { $gte: weekAgo } }),
    Application.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: { $dateTrunc: { date: '$createdAt', unit: 'week' } },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
      { $project: {
        _id: 0,
        week: { $dateToString: { format: '%b %d', date: '$_id' } },
        count: 1,
      }},
    ]),
  ]);

  const statusMap = Object.fromEntries(byStatus.map(s => [s._id, s.count]));
  const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
  const responded = (statusMap.phone_screen || 0) + (statusMap.technical || 0) +
    (statusMap.final_round || 0) + (statusMap.offer || 0) + (statusMap.rejected || 0);

  res.json({
    total,
    byStatus: statusMap,
    responseRate: total > 0 ? Math.round((responded / total) * 100) / 100 : 0,
    thisWeek,
    perWeek,
  });
});

export const exportApplications = catchAsync(async (req, res) => {
  const apps = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });

  const escape = v => `"${String(v || '').replace(/"/g, '""')}"`;
  const header = 'Company,Role,Status,Applied Date,Deadline,Job URL,Notes\r\n';
  const rows = apps.map(a => [
    escape(a.company),
    escape(a.role),
    a.status,
    a.appliedDate ? a.appliedDate.toISOString().split('T')[0] : '',
    a.deadline    ? a.deadline.toISOString().split('T')[0]    : '',
    escape(a.jobUrl),
    a.notes.length,
  ].join(',')).join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
  res.send(header + rows);
});

export const addNote = catchAsync(async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(422).json({ message: 'Note body is required' });

  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $push: { notes: { body: body.trim() } } },
    { new: true }
  );
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.status(201).json({ application: app });
});

export const deleteNote = catchAsync(async (req, res) => {
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $pull: { notes: { _id: req.params.noteId } } },
    { new: true }
  );
  if (!app) return res.status(404).json({ message: 'Not found' });
  res.json({ application: app });
});
