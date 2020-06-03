export enum rent_state {
    not_yet_validated = 0,
    waiting_for_start = 1,
    inventory_before_start = 2,
    ongoing = 3,
    inventory_after_start = 4,
    terminated = 5,
    canceled = 6
    }