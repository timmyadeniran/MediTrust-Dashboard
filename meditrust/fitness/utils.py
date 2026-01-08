def calculate_distance(steps, step_length=0.78):
    return round((steps * step_length) / 1000, 2)

def calculate_calories(steps, weight):
    # Approx medical estimate
    return round(steps * 0.04 * (weight / 70), 2)
