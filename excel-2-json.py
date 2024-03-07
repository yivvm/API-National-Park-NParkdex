import pandas as pd

def xlsx_to_json(inpput_file, output_file):
    try:
        # read excel file
        df = pd.read_excel(input_file)

        # convert DataFrame to JSON and save to file
        df.to_json(output_file, orient='records', indent=4)
        print('conversion successful')
    except Exception as e:
        print('error: ', e)


if __name__ == "__main__":
    input_file = 'NPS-Unit-List.xlsx'
    output_file = 'output.json'
    xlsx_to_json(input_file, output_file)