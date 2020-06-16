export enum booking_status {
    booked_inside = 0,
    waiting_for_validation =4,
    free = 3,
    booked_outside = 1,
    busy= 5,
    on_going =6
  }

export enum paiement_status {
   validated = 1,
   not_yet_validated = 0,
   refunded = 2,
   not_validated = 3
}

export enum inventoryState 
{
	 inventory_start = 0,
	 inventory_start_done = 1,
	 inventory_start_confirmed = 2,
	 inventory_end_done= 3,
	 inventory_end_confirmed = 4,
}

