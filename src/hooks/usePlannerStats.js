import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { daysUntil, isOverdue, isDueSoon } from '../utils/dateUtils';

/**
 * Central place where raw data is turned into the numbers and signals
 * the Dashboard and AI Assistant actually display. Keeping this logic
 * in one hook means every screen that needs "progress %" or "overdue
 * tasks" computes it the same way.
 */
export function usePlannerStats() {
  const { data } = useApp();

  return useMemo(() => {
    const tasks = data.tasks || [];
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    const progressPct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status));
    const dueSoonTasks = tasks
      .filter((t) => isDueSoon(t.dueDate, t.status, 7))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const categories = data.budget?.categories || [];
    const totalPlanned = categories.reduce((sum, c) => sum + (Number(c.planned) || 0), 0);
    const totalSpent = categories.reduce((sum, c) => sum + (Number(c.spent) || 0), 0);
    const remaining = totalPlanned - totalSpent;
    const overBudgetCategories = categories.filter((c) => Number(c.spent) > Number(c.planned) && Number(c.planned) > 0);
    const budgetUtilization = totalPlanned === 0 ? 0 : Math.round((totalSpent / totalPlanned) * 100);

    const lobolaDays = daysUntil(data.meta?.lobolaDate);
    const weddingDays = daysUntil(data.meta?.weddingDate);

    const guests = data.guests || [];
    const confirmedGuests = guests.filter((g) => g.rsvp === 'confirmed');
    const declinedGuests = guests.filter((g) => g.rsvp === 'declined');
    const pendingGuests = guests.filter((g) => g.rsvp === 'pending');
    const totalHeadcount = confirmedGuests.reduce((sum, g) => sum + (Number(g.partySize) || 1), 0);

    const risks = data.risks || [];
    const unpreparedRisks = risks.filter((r) => r.status === 'not-prepared');

    const vendors = data.vendors || [];
    const vendorPaymentsDue = [];
    vendors.forEach((v) => {
      (v.paymentSchedule || []).forEach((p) => {
        if (!p.paid && p.dueDate) {
          const d = daysUntil(p.dueDate);
          if (d !== null && d <= 14) {
            vendorPaymentsDue.push({ vendorName: v.name, ...p, daysUntil: d });
          }
        }
      });
    });
    vendorPaymentsDue.sort((a, b) => a.daysUntil - b.daysUntil);
    const unbookedCriticalVendors = vendors.filter(
      (v) => v.category === 'Venue' || v.category === 'Caterer'
    ).filter((v) => v.status === 'considering' || v.status === 'contacted');

    // ---- AI Assistant style suggestions (rule-based, fully local) ----
    const suggestions = [];

    if (overdueTasks.length > 0) {
      suggestions.push({
        type: 'warning',
        text: `${overdueTasks.length} task${overdueTasks.length > 1 ? 's are' : ' is'} overdue. Tackle "${overdueTasks[0].title}" first.`,
      });
    }

    if (vendorPaymentsDue.length > 0) {
      const next = vendorPaymentsDue[0];
      suggestions.push({
        type: next.daysUntil < 0 ? 'danger' : 'warning',
        text: next.daysUntil < 0
          ? `A payment to ${next.vendorName} ("${next.label}") is overdue.`
          : `${next.vendorName} payment ("${next.label}") is due in ${next.daysUntil} day${next.daysUntil === 1 ? '' : 's'}.`,
      });
    }

    if (overBudgetCategories.length > 0) {
      suggestions.push({
        type: 'danger',
        text: `${overBudgetCategories[0].name} has gone over its planned budget. Consider reallocating funds or revisiting the plan.`,
      });
    }

    if (lobolaDays !== null && lobolaDays > 0 && lobolaDays <= 14) {
      suggestions.push({
        type: 'info',
        text: `Lobola day is ${lobolaDays} day${lobolaDays === 1 ? '' : 's'} away. Confirm cattle/cash requirements and transport are finalised.`,
      });
    }

    if (weddingDays !== null && weddingDays > 0 && weddingDays <= 30 && pendingGuests.length > 0) {
      suggestions.push({
        type: 'warning',
        text: `${pendingGuests.length} guests haven't responded yet and the wedding is in ${weddingDays} days. Send a reminder.`,
      });
    }

    if (totalPlanned > 0 && budgetUtilization >= 90 && budgetUtilization < 100) {
      suggestions.push({
        type: 'warning',
        text: `You've used ${budgetUtilization}% of your total budget. Review remaining categories before approving new spend.`,
      });
    }

    if (weddingDays !== null && weddingDays > 0 && weddingDays <= 60 && unbookedCriticalVendors.length > 0) {
      suggestions.push({
        type: 'warning',
        text: `${unbookedCriticalVendors[0].category} ("${unbookedCriticalVendors[0].name}") isn't booked yet and the wedding is ${weddingDays} days away. Confirm soon.`,
      });
    }

    if (weddingDays !== null && weddingDays > 0 && weddingDays <= 21 && unpreparedRisks.length > 0) {
      suggestions.push({
        type: 'warning',
        text: `${unpreparedRisks.length} backup plan${unpreparedRisks.length > 1 ? 's are' : ' is'} still not prepared (e.g. "${unpreparedRisks[0].title}"). Worth a look before the day.`,
      });
    }

    if (dueSoonTasks.length > 0 && suggestions.length < 4) {
      suggestions.push({
        type: 'info',
        text: `Next up: "${dueSoonTasks[0].title}" is due ${dueSoonTasks[0].dueDate}.`,
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        text: "You're on track. No overdue tasks or budget issues right now.",
      });
    }

    return {
      totalTasks,
      doneTasks,
      progressPct,
      overdueTasks,
      dueSoonTasks,
      totalPlanned,
      totalSpent,
      remaining,
      budgetUtilization,
      overBudgetCategories,
      lobolaDays,
      weddingDays,
      confirmedGuests,
      declinedGuests,
      pendingGuests,
      totalHeadcount,
      vendors,
      vendorPaymentsDue,
      unbookedCriticalVendors,
      risks,
      unpreparedRisks,
      suggestions: suggestions.slice(0, 4),
    };
  }, [data]);
}
