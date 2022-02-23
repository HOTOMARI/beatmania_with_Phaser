#include<iostream>
#include<vector>
#include<fstream>
#include<math.h>
using namespace std;

class Note {
public:
	int time{};
	int measure{};
};

int main() {
	vector<Note> notes;
	Note note;
	ofstream out;
	double time = 0;
	int pre_time = 0;
	float bpm;
	int measure;
	int line = 0;
	int count = 1;
	int note_num = 0;

	notes.reserve(1000);

	cout << "bpm 입력: ";
	cin >> bpm;
	cout << "시작마디 입력: ";
	cin >> measure;
	cout << "노트갯수: ";
	do {
		cin >> note_num;
	} while (note_num < 0);
	if (note_num > 7)note_num = 6;

	time = 1 / (bpm / 60.0) * (4 * (measure - 1));
	cout << count << ". 시작 시간: " << time * 1000 << endl;
	note.time = round(time * 1000);
	note.measure = measure;
	for (int i = 0; i < note_num; ++i)
		notes.push_back(note);
	note_num = 0 ;
	count++;

	for (;;) {
		int num;
		cout << "박자 입력: ";
		do {
			cin >> num;
		} while (num < 4 && num>0);
		switch (num)
		{
			// 마디 넘기기
			// 다음마디 처음에 자동으로 노트찍힘
		case -1:
			cout << "노트갯수: ";
			do {
				cin >> note_num;
			} while (note_num < 0);
			if (note_num > 7)note_num = 6;
			time = 1 / (bpm / 60.0) * (4 * measure);
			count = 1;
			cout << "---------------------------------------\n";
			cout << "현재 마디:" << ++measure << endl;
			cout << count << ". 시간: " << time * 1000 << endl;
			note.time = time * 1000;
			note.measure = measure;
			for (int i = 0; i < note_num; ++i)
				notes.push_back(note);
			note_num = 0;
			count++;
			break;

		// 파일출력
		case 0:
			out.open("notes.json");

			out << "{\n\"bpm\":" << bpm << ",\n";
			out << "\"minbpm\":" << bpm << ",\n";
			out << "\"maxbpm\":" << bpm << ",\n";

			out << "\"length\":" << 0 << ",\n";

			out << "\"speedTrigger\":1" << ",\n";
			out << "\"speedData\":[\n";
			out << "{\"speed\":1.0" << ",\"time\":0" << "}\n";
			out << "],\n";

			out << "\"noteNum\":" << notes.size() << ",\n";
			out << "\"noteData\":[\n";

			for (Note data : notes) {
				out << "{\"time\":" << data.time << ",\"line\":" << line << ", \"measure\":" << data.measure << "},\n";
				line++;
				line %= 6;
			}

			out << "]\n}\n";

			return 0;
			break;

			// 노트찍기
			// 음수면 노트 안찍고 박자 넘기기
		default:
			if (num < 0) {
				time = time + (1 / (bpm / 60.0) / (-num / 4));
			}
			else {
				cout << "노트갯수: ";
				do {
					cin >> note_num;
				} while (note_num < 0);
				if (note_num > 7)note_num = 6;
				time = time + (1 / (bpm / 60.0) / (num / 4));
				cout << count << ". 시간: " << time * 1000 << endl;
				note.time = round(time * 1000);
				note.measure = measure;
				for (int i = 0; i < note_num; ++i)
					notes.push_back(note);
				note_num = 0;
				count++;
			}
			break;
		}
	}
}