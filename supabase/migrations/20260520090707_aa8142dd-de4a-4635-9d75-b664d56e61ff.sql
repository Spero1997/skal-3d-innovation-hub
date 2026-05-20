DROP TRIGGER IF EXISTS trg_invoices_set_number ON public.invoices;
CREATE TRIGGER trg_invoices_set_number
  BEFORE INSERT OR UPDATE OF amount_ht, vat_rate ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();