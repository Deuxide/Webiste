import time

def counting_sort(arr, exp):
    """
    A stable counting sort that sorts numbers based on the digit represented by exp.
    """
    n = len(arr)
    output = [0] * n  # Output array
    count = [0] * 10  # Count array for digits 0-9

    # Count occurrences of each digit at the current place value
    for i in arr:
        index = (i // exp) % 10
        count[index] += 1

    # Update count[i] to have the position of this digit in the output array
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Build the output array by placing numbers in their correct positions
    i = n - 1
    while i >= 0:
        index = (arr[i] // exp) % 10
        output[count[index] - 1] = arr[i]
        count[index] -= 1
        i -= 1

    # Copy the sorted numbers back to the original array
    for i in range(n):
        arr[i] = output[i]

def radix_sort(arr):
    """
    Main function to implement Radix Sort.
    """
    # Find the maximum number to determine the number of digits
    max_num = max(arr)

    # Perform counting sort for each digit (1s, 10s, 100s, ...)
    exp = 1
    while max_num // exp > 0:
        counting_sort(arr, exp)
        exp *= 10

# Generate an array of 500 random integers to sort
import random
count = 10000
abc = 1
random_numbers = [random.randint(1, count) for _ in range(count)]

if abc == 1:
    print("Original array:")
    print(random_numbers)

# Measure sorting time
start_time = time.time()
radix_sort(random_numbers)
end_time = time.time()

if abc == 1:
    print("\nSorted array:")
    print(random_numbers)

# Print time taken to sort
milisecond = (end_time - start_time) * 1000
milisecond = round(milisecond)
print(f"\nTime taken to sort: {end_time - start_time:.6f} seconds")
print("\ntime it takes in miliseconds :",milisecond, "ms")
